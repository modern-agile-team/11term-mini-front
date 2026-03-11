import { useCallback, useEffect, useState } from 'react';
import type { ChatMessage } from '../types';
import {
  fetchRoomMessages,
  joinTalkRoom,
  markTalkRoomAsRead,
  sendRoomMessage,
  subscribeRoomMessages,
} from '../api/chatApi';

const CHAT_MESSAGES_STORAGE_KEY = 'chatMessagesByRoom';
const CHAT_DRAFTS_STORAGE_KEY = 'chatDraftsByRoom';

const isPersistableRoomId = (roomId: string): boolean => !roomId.startsWith('room-');

const isChatMessage = (value: unknown): value is ChatMessage => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ChatMessage>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.roomId === 'string' &&
    (candidate.senderType === 'me' || candidate.senderType === 'other') &&
    typeof candidate.content === 'string' &&
    typeof candidate.createdAt === 'string'
  );
};

const readStoredDrafts = (): Record<string, string> => {
  const raw = localStorage.getItem(CHAT_DRAFTS_STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>)
        .filter(([key]) => isPersistableRoomId(key))
        .filter(([, value]) => typeof value === 'string')
        .map(([key, value]) => [key, String(value)])
    ) as Record<string, string>;
  } catch {
    return {};
  }
};

const readStoredMessages = (): Record<string, ChatMessage[]> => {
  const raw = localStorage.getItem(CHAT_MESSAGES_STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>)
        .filter(([roomKey]) => isPersistableRoomId(roomKey))
        .map(([roomKey, value]) => {
          const messages = Array.isArray(value) ? value.filter(isChatMessage) : [];
          return [
            roomKey,
            messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
          ];
        })
    );
  } catch {
    return {};
  }
};

/**
 * useChatMessages
 *
 * ✅ 원리: "메시지 로딩/전송" 로직을 UI에서 분리
 * - UI(컴포넌트)는 messages/draft/sendMessage만 받아서 그리기만 한다.
 * - 메시지 로드, 소켓 구독, 전송 동기화를 여기서 관리한다.
 */
export function useChatMessages(roomId: string | null) {
  // 입력창(제어 컴포넌트) 상태
  const [draftsByRoom, setDraftsByRoom] = useState<Record<string, string>>(() => readStoredDrafts());
  const [messagesByRoom, setMessagesByRoom] = useState<Record<string, ChatMessage[]>>(() => readStoredMessages());

  const draft = roomId ? (draftsByRoom[roomId] ?? '') : '';
  const messages = roomId ? (messagesByRoom[roomId] ?? []) : [];

  const setDraft = (value: string) => {
    if (!roomId) return;
    setDraftsByRoom((prev) => ({
      ...prev,
      [roomId]: value,
    }));
  };

  const reconcileMessages = useCallback(
    (prevMessages: ChatMessage[], serverMessages: ChatMessage[]): ChatMessage[] => {
      const pendingLocals = prevMessages.filter(
        (msg) => msg.id.startsWith('local-') && msg.roomId === roomId
      );

      const unresolvedLocals = pendingLocals.filter((local) => {
        const localTs = new Date(local.createdAt).getTime();
        return !serverMessages.some((server) => {
          const serverTs = new Date(server.createdAt).getTime();
          return (
            server.senderType === 'me' &&
            server.content === local.content &&
            Math.abs(serverTs - localTs) < 15000
          );
        });
      });

      return [...serverMessages, ...unresolvedLocals].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    },
    [roomId]
  );

  useEffect(() => {
    localStorage.setItem(CHAT_DRAFTS_STORAGE_KEY, JSON.stringify(draftsByRoom));
  }, [draftsByRoom]);

  useEffect(() => {
    localStorage.setItem(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(messagesByRoom));
  }, [messagesByRoom]);

  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = subscribeRoomMessages(roomId, (incoming) => {
      setMessagesByRoom((prev) => {
        const currentMessages = prev[roomId] ?? [];
        if (currentMessages.some((msg) => msg.id === incoming.id)) return prev;

        const resolved = currentMessages.filter((msg) => {
          if (!msg.id.startsWith('local-')) return true;
          const localTs = new Date(msg.createdAt).getTime();
          const incomingTs = new Date(incoming.createdAt).getTime();
          return !(
            msg.senderType === incoming.senderType &&
            msg.content === incoming.content &&
            Math.abs(localTs - incomingTs) < 15000
          );
        });

        return {
          ...prev,
          [roomId]: [...resolved, incoming].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ),
        };
      });
    });

    return unsubscribe;
  }, [roomId]);

  // roomId가 바뀌면(다른 방 클릭) 해당 방의 메시지로 교체
  useEffect(() => {
    let cancelled = false;
    if (!roomId) return;

    const loadMessages = async () => {
      try {
        joinTalkRoom(roomId);
        markTalkRoomAsRead(roomId);
        const { messages: serverMessages } = await fetchRoomMessages(roomId);
        if (cancelled) return;
        setMessagesByRoom((prev) => ({
          ...prev,
          [roomId]: reconcileMessages(prev[roomId] ?? [], serverMessages),
        }));
      } catch {
        setMessagesByRoom((prev) => {
          if ((prev[roomId] ?? []).length === 0) {
            return {
              ...prev,
              [roomId]: [],
            };
          }
          return prev;
        });
      }
    };

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [reconcileMessages, roomId]);

  const sendMessage = async () => {
    const text = draft.trim();
    if (!text || !roomId) return;

    // ✅ 1) 화면 즉시 반영(낙관적 업데이트)
    const optimistic: ChatMessage = {
      id: `local-${Date.now()}`, // 서버 연결 시 서버 id로 치환 가능
      roomId,
      senderType: 'me',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessagesByRoom((prev) => ({
      ...prev,
      [roomId]: [...(prev[roomId] ?? []), optimistic],
    }));

    // ✅ 2) 입력창 비우기
    setDraftsByRoom((prev) => ({
      ...prev,
      [roomId]: '',
    }));

    // ✅ 3) 서버 전송 시도 후 최신 메시지 동기화
    try {
      await sendRoomMessage(roomId, text);
      const { messages: latest } = await fetchRoomMessages(roomId);
      setMessagesByRoom((prev) => ({
        ...prev,
        [roomId]: reconcileMessages(prev[roomId] ?? [], latest),
      }));
    } catch {
      // 전송 실패 시 optimistic만 남겨 사용자 입력 유실 방지
    }
  };

  return {
    messages,
    draft,
    setDraft,
    sendMessage,
  };
}
