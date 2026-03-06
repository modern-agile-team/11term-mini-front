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
  createdAt: string;
}

const ROOMS_KEY = 'mockTalkRooms';
const MESSAGES_KEY = 'mockTalkMessagesByRoom';

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
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'm-2',
      uid: 10,
      content: '네, 거래 가능합니다.',
      createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    },
  ],
  '2': [
    {
      id: 'm-3',
      uid: 21,
      content: '배터리 사이클 수가 궁금해요.',
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: 'm-4',
      uid: 11,
      content: '확인 후 바로 알려드릴게요.',
      createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
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

export const chathandler = [
  http.get('/api/talks/rooms', () => {
    return HttpResponse.json(getRooms());
  }),

  http.get('/api/talks/rooms/:roomId/messages', ({ params }) => {
    const normalizedRoomId = normalizeRoomId(String(params.roomId));
    if (!normalizedRoomId) return new HttpResponse(null, { status: 400 });

    const messagesByRoom = getMessagesByRoom();
    return HttpResponse.json({
      data: messagesByRoom[normalizedRoomId] ?? [],
      cursor: null,
    });
  }),

  http.post('/api/talks/rooms/:roomId/messages', async ({ params, request }) => {
    const normalizedRoomId = normalizeRoomId(String(params.roomId));
    if (!normalizedRoomId) return new HttpResponse(null, { status: 400 });

    const body = (await request.json()) as {
      content?: string;
      messageType?: number;
    };

    const content = body.content?.trim();
    if (!content) return new HttpResponse(null, { status: 400 });

    const uid = getCurrentUserId(request);
    const createdAt = new Date().toISOString();
    const nextMessage: MockTalkMessage = {
      id: `m-${Date.now()}`,
      uid,
      content,
      createdAt,
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
];
