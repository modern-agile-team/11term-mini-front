import { useCallback, useEffect, useState } from 'react';
import type { ChatMessage } from '../types/chat';
import {
  fetchRoomMessages,
  joinTalkRoom,
  markTalkRoomAsRead,
  sendRoomMessage,
  subscribeRoomMessages,
} from '../api/chatApi';

const messageDraftCache: Record<string, string> = {};
const roomMessageCache: Record<string, ChatMessage[]> = {};

/**
 * useChatMessages
 *
 * ✅ 원리: "메시지 로딩/전송" 로직을 UI에서 분리
 * - UI(컴포넌트)는 messages/draft/sendMessage만 받아서 그리기만 한다.
 * - 메시지 로드, 소켓 구독, 전송 동기화를 여기서 관리한다.
 */
export function useChatMessages(roomId: string | null) {
  const [draftsByRoom, setDraftsByRoom] = useState<Record<string, string>>(() => messageDraftCache);
  const [messagesByRoom, setMessagesByRoom] = useState<Record<string, ChatMessage[]>>(
    () => roomMessageCache
  );

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
    Object.assign(messageDraftCache, draftsByRoom);
    Object.keys(messageDraftCache).forEach((key) => {
      if (!(key in draftsByRoom)) delete messageDraftCache[key];
    });
  }, [draftsByRoom]);

  useEffect(() => {
    Object.assign(roomMessageCache, messagesByRoom);
    Object.keys(roomMessageCache).forEach((key) => {
      if (!(key in messagesByRoom)) delete roomMessageCache[key];
    });
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
