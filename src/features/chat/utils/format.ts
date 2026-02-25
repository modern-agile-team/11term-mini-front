/**
 * chat/utils/format.ts
 *
 * ✅ 원리: 날짜/라벨 같은 "보조 로직"은 컴포넌트 밖으로 빼기
 * - UI 컴포넌트가 복잡해지는 걸 막고
 * - 나중에 포맷 바꾸기도 쉬움
 */

import type { ChatTab } from '../types';

export const CHAT_TAB_LABEL: Record<ChatTab, string> = {
  ALL: '전체',
  WAITING: '대기',
  IN_PROGRESS: '진행중',
  CLOSED: '대화종료',
  CONTACTING: '연락중',
};

export function formatRoomTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';

  const now = new Date();
  const isSameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  if (isSameDay) {
    // 예: 14:05
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  }

  // 예: 2월 23일
  return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
}
