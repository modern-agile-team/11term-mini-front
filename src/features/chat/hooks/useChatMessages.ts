import { useCallback, useEffect, useState } from 'react';
import type { ChatMessage } from '../types';
import { MOCK_MESSAGES } from '../mock';
import { fetchRoomMessages, sendRoomMessage } from '../api/chatApi';

/**
 * useChatMessages
 *
 * ✅ 원리: "메시지 로딩/전송" 로직을 UI에서 분리
 * - UI(컴포넌트)는 messages/draft/sendMessage만 받아서 그리기만 한다.
 * - 지금은 mock 기반이지만, 나중에:
 *   1) roomId로 fetch
 *   2) socket.on('new_message') 구독
 *   3) socket.emit('send_message') 전송
 *   을 여기서 붙이면 된다.
 */
export function useChatMessages(roomId: string | null) {
  // 입력창(제어 컴포넌트) 상태
  const [draftsByRoom, setDraftsByRoom] = useState<Record<string, string>>({});

  // ✅ "화면에 보여줄 메시지 목록"은 state로 관리해야,
  //    전송했을 때 즉시 UI에 append(낙관적 업데이트)할 수 있다.
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const draft = roomId ? (draftsByRoom[roomId] ?? '') : '';

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

  const isMockRoom = roomId?.startsWith('room-') ?? false;

  // roomId가 바뀌면(다른 방 클릭) 해당 방의 메시지로 교체
  useEffect(() => {
    let cancelled = false;
    if (!roomId) return;
    if (isMockRoom) {
      const timer = window.setTimeout(() => {
        if (cancelled) return;
        const initial = MOCK_MESSAGES.filter((m) => m.roomId === roomId);
        setMessages(initial);
      }, 0);

      return () => {
        cancelled = true;
        window.clearTimeout(timer);
      };
    }

    const loadMessages = async () => {
      try {
        const serverMessages = await fetchRoomMessages(roomId);
        if (cancelled) return;
        setMessages((prev) => reconcileMessages(prev, serverMessages));
      } catch {
        // 폴링 실패 시 화면 메시지를 유지(입력 직후 메시지 유실 방지)
        setMessages((prev) => {
          const currentRoomMessages = prev.filter((m) => m.roomId === roomId);
          if (currentRoomMessages.length > 0) return currentRoomMessages;
          const initial = MOCK_MESSAGES.filter((m) => m.roomId === roomId);
          return initial;
        });
      }
    };

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [isMockRoom, reconcileMessages, roomId]);

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

    setMessages((prev) => [...prev, optimistic]);

    // ✅ 2) 입력창 비우기
    setDraftsByRoom((prev) => ({
      ...prev,
      [roomId]: '',
    }));

    // ✅ 3) 서버 전송 시도 후 최신 메시지 동기화
    if (isMockRoom) return;

    try {
      await sendRoomMessage(roomId, text);
      const latest = await fetchRoomMessages(roomId);
      setMessages((prev) => reconcileMessages(prev, latest));
    } catch {
      // 전송 실패 시 optimistic만 남겨 사용자 입력 유실 방지
    }
  };

  return {
    messages: roomId ? messages.filter((m) => m.roomId === roomId) : [],
    draft,
    setDraft,
    sendMessage,
  };
}
