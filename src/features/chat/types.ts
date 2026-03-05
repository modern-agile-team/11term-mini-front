/**
 * chat/types.ts
 *
 * ✅ 원리: "화면(UI)"이 아니라 "데이터 규칙"만 담는 파일
 * - 어떤 형태의 데이터가 오고/가야 하는지(채팅방, 메시지)
 * - UI/서버/목데이터(mock)가 모두 이 규칙을 따라가게 만들어서, 나중에 바꿀 때 덜 깨지게 함
 */

/** 상단 탭(필터)에서 사용하는 '상태' 값들 */
export type ChatTab = 'ALL' | 'WAITING' | 'IN_PROGRESS' | 'CLOSED' | 'CONTACTING';

/** 채팅이 어디서 온 대화인지(번개톡 등). 지금은 번개톡만, 나중에 확장 가능 */
export type ChatChannel = 'BUNGGAETALK';

/**
 * "몇몇 문의사항이 번개톡(채팅)으로 연결"되는 구조를 대비한 참조 타입
 * - 채팅이 '문의 도메인'을 통째로 들고 있지 않게끔(결합도↓)
 * - 최소한의 식별자(id) + 화면에 보여줄 요약(title)만 들고 있음
 */
export interface LinkedInquiry {
  inquiryId: string;
  title: string;
}

/** 좌측 리스트(채팅방 목록)에서 필요한 정보들 */
export interface ChatRoom {
  id: string;
  channel: ChatChannel;
  title: string; // 상대/방 이름
  tab: ChatTab;  // 이 방이 어떤 탭에 속하는지
  
  lastMessage: string;
  lastMessageAt: string; // ISO string (서버/클라 공용)
  unreadCount: number;

  linkedInquiries?: LinkedInquiry[];
}

/** 메시지 말풍선 좌/우 구분용(=UI 관점 최적화) */
export type SenderType = 'me' | 'other';

/** 우측 대화창(메시지 목록)에서 사용하는 메시지 타입 */
export interface ChatMessage {
  id: string;
  roomId: string;
  senderType: SenderType;
  content: string;
  createdAt: string; // ISO string
}
