import { http, HttpResponse } from 'msw';

interface MockTalkRoom {
  id: number;
  productId: number;
  buyerId: number;
  sellerId: number;
  updatedAt: string;
  productTitle: string;
  productPrice: number;
  lastMessage: string;
  unreadCount: number;
}

interface MockTalkMessage {
  id: string;
  uid: number;
  content: string;
  extra: string;
  messageType: number;
  additionalInfo: null;
  createdAt: string;
  visibility: 'ALL';
}

interface MockCategory {
  id: number;
  name: string;
  sub?: MockCategory[];
}

const ROOMS_KEY = 'mockTalkRooms';
const MESSAGES_KEY = 'mockTalkMessagesByRoom';

const DEFAULT_CATEGORIES: MockCategory[] = [
  {
    id: 1,
    name: '여성의류',
    sub: [
      { id: 26, name: '아우터' },
      { id: 27, name: '상의' },
      { id: 28, name: '바지' },
      { id: 29, name: '스커트' },
    ],
  },
  {
    id: 2,
    name: '남성의류',
    sub: [
      { id: 30, name: '아우터' },
      { id: 31, name: '상의' },
      { id: 32, name: '바지' },
    ],
  },
  {
    id: 3,
    name: '신발',
    sub: [
      { id: 33, name: '스니커즈' },
      { id: 34, name: '구두' },
      { id: 35, name: '부츠' },
    ],
  },
];

const createDefaultRooms = (): MockTalkRoom[] => {
  const now = Date.now();
  return [
    {
      id: 1,
      productId: 101,
      buyerId: 10,
      sellerId: 20,
      updatedAt: new Date(now - 1000 * 60 * 30).toISOString(),
      productTitle: '아이폰 13 미니',
      productPrice: 430000,
      lastMessage: '네, 오늘 거래 가능합니다.',
      unreadCount: 0,
    },
    {
      id: 2,
      productId: 202,
      buyerId: 11,
      sellerId: 21,
      updatedAt: new Date(now - 1000 * 60 * 7).toISOString(),
      productTitle: '맥북 에어 M2',
      productPrice: 890000,
      lastMessage: '사진 더 보내드릴게요.',
      unreadCount: 1,
    },
  ];
};

const createDefaultMessagesByRoom = (): Record<string, MockTalkMessage[]> => ({
  '1': [
    {
      id: 'm-1',
      uid: 20,
      content: '안녕하세요, 아직 판매 중인가요?',
      extra: '{}',
      messageType: 0,
      additionalInfo: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      visibility: 'ALL',
    },
    {
      id: 'm-2',
      uid: 10,
      content: '네, 거래 가능합니다.',
      extra: '{}',
      messageType: 0,
      additionalInfo: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      visibility: 'ALL',
    },
  ],
  '2': [
    {
      id: 'm-3',
      uid: 21,
      content: '배터리 사이클 수가 궁금해요.',
      extra: '{}',
      messageType: 0,
      additionalInfo: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      visibility: 'ALL',
    },
    {
      id: 'm-4',
      uid: 11,
      content: '확인 후 바로 알려드릴게요.',
      extra: '{}',
      messageType: 0,
      additionalInfo: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
      visibility: 'ALL',
    },
  ],
});

const getRooms = (): MockTalkRoom[] => {
  const stored = localStorage.getItem(ROOMS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as MockTalkRoom[];
    } catch {
      // invalid local storage format
    }
  }
  const defaults = createDefaultRooms();
  localStorage.setItem(ROOMS_KEY, JSON.stringify(defaults));
  return defaults;
};

const getMessagesByRoom = (): Record<string, MockTalkMessage[]> => {
  const stored = localStorage.getItem(MESSAGES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Record<string, MockTalkMessage[]>;
    } catch {
      // invalid local storage format
    }
  }
  const defaults = createDefaultMessagesByRoom();
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(defaults));
  return defaults;
};

const setRooms = (rooms: MockTalkRoom[]) => {
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
};

const setMessagesByRoom = (messagesByRoom: Record<string, MockTalkMessage[]>) => {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messagesByRoom));
};

const normalizeRoomId = (raw: string | undefined): string | null => {
  if (!raw) return null;
  if (/^\d+$/.test(raw)) return raw;
  const match = raw.match(/^room-(\d+)$/);
  return match?.[1] ?? null;
};

const getCurrentUserId = (request: Request): number => {
  const header = request.headers.get('x-user-id');
  const parsed = Number(header);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return 10;
};

const toMessageListResponse = (messages: MockTalkMessage[]) => {
  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const minDate = sorted[0]?.createdAt ?? new Date().toISOString();
  const otherLastMsgCreatedAt = sorted[sorted.length - 1]?.createdAt ?? minDate;

  return {
    readableStartAt: minDate,
    otherLastMsgCreatedAt,
    minMessageDateGuide: null,
    minMessageDate: minDate,
    data: sorted,
    cursor: null,
  };
};

export const chathandler = [
  http.get('/api/talks/rooms', () => {
    return HttpResponse.json(getRooms());
  }),

  http.post('/api/talks/rooms', async ({ request }) => {
    const body = (await request.json()) as { productId?: number };
    const productId = Number(body.productId);
    if (!Number.isFinite(productId)) return new HttpResponse(null, { status: 400 });

    const uid = getCurrentUserId(request);
    const rooms = getRooms();
    const existing = rooms.find((room) => room.productId === productId);
    if (existing) return HttpResponse.json({ id: existing.id }, { status: 201 });

    const createdAt = new Date().toISOString();
    const nextId = rooms.reduce((max, room) => Math.max(max, room.id), 0) + 1;
    const createdRoom: MockTalkRoom = {
      id: nextId,
      productId,
      buyerId: uid,
      sellerId: 9999,
      updatedAt: createdAt,
      productTitle: `상품 #${productId}`,
      productPrice: 0,
      lastMessage: '',
      unreadCount: 0,
    };

    setRooms([createdRoom, ...rooms]);

    const messagesByRoom = getMessagesByRoom();
    messagesByRoom[String(nextId)] = [];
    setMessagesByRoom(messagesByRoom);

    return HttpResponse.json({ id: nextId }, { status: 201 });
  }),

  http.get('/api/talks/rooms/:roomId/messages', ({ params, request }) => {
    const normalizedRoomId = normalizeRoomId(String(params.roomId));
    if (!normalizedRoomId) return new HttpResponse(null, { status: 400 });

    const cursor = new URL(request.url).searchParams.get('cursor');

    const messagesByRoom = getMessagesByRoom();
    const allMessages = messagesByRoom[normalizedRoomId] ?? [];
    const filtered = cursor
      ? allMessages.filter((message) => new Date(message.createdAt).getTime() < new Date(cursor).getTime())
      : allMessages;

    return HttpResponse.json(toMessageListResponse(filtered));
  }),

  http.post('/api/talks/upload', async ({ request }) => {
    const body = (await request.json()) as { imageUrl?: string | number };
    const imageUrl = String(body.imageUrl ?? '');
    if (!imageUrl) return new HttpResponse(null, { status: 400 });
    return HttpResponse.json({ imageUrl }, { status: 200 });
  }),

  // 소켓 미연결 개발 환경에서 send_message 대체용 fallback
  http.post('/api/talks/rooms/:roomId/messages', async ({ params, request }) => {
    const normalizedRoomId = normalizeRoomId(String(params.roomId));
    if (!normalizedRoomId) return new HttpResponse(null, { status: 400 });

    const body = (await request.json()) as {
      content?: string;
      messageType?: number;
      extra?: string;
    };

    const content = body.content?.trim();
    if (!content) return new HttpResponse(null, { status: 400 });

    const uid = getCurrentUserId(request);
    const createdAt = new Date().toISOString();
    const nextMessage: MockTalkMessage = {
      id: `m-${Date.now()}`,
      uid,
      content,
      extra: body.extra ?? '{}',
      messageType: Number.isFinite(body.messageType) ? Number(body.messageType) : 0,
      additionalInfo: null,
      createdAt,
      visibility: 'ALL',
    };

    const messagesByRoom = getMessagesByRoom();
    messagesByRoom[normalizedRoomId] = [...(messagesByRoom[normalizedRoomId] ?? []), nextMessage];
    setMessagesByRoom(messagesByRoom);

    const rooms = getRooms();
    const roomIdx = rooms.findIndex((room) => String(room.id) === normalizedRoomId);
    if (roomIdx >= 0) {
      rooms[roomIdx] = {
        ...rooms[roomIdx],
        lastMessage: content,
        updatedAt: createdAt,
      };
      setRooms(rooms);
    }

    return HttpResponse.json({ success: true }, { status: 201 });
  }),

  http.get('/api/categories', () => {
    return HttpResponse.json(DEFAULT_CATEGORIES);
  }),
];
