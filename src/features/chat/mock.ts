/**
 * chat/mock.ts
 *
 * ✅ 원리: 서버(API)가 아직 없을 때도 UI를 완성할 수 있게 하는 '가짜 데이터'
 * - 나중에 서버 붙이면 이 파일은 지우거나, 개발용으로만 남겨둬도 됨
 */

import type { ChatMessage, ChatRoom } from './types';

export const MOCK_ROOMS: ChatRoom[] = [
  {
    id: 'room-1',
    channel: 'BUNGGAETALK',
    title: '번개장터',
    tab: 'WAITING',
    lastMessage: '번개장터에 오신 걸 환영해요 🎉',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unreadCount: 2,
    linkedInquiries: [{ inquiryId: 'inq-102', title: '배송 문의' }],
  },
  {
    id: 'room-2',
    channel: 'BUNGGAETALK',
    title: '애플매니아',
    tab: 'IN_PROGRESS',
    lastMessage: '네, 택배 발송 후 송장번호 알려드릴게요.',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    unreadCount: 0,
  },
  {
    id: 'room-3',
    channel: 'BUNGGAETALK',
    title: '연락중-상대방',
    tab: 'CONTACTING',
    lastMessage: '지금 연락 가능하실까요?',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unreadCount: 1,
  },
  {
    id: 'room-4',
    channel: 'BUNGGAETALK',
    title: '종료된 대화',
    tab: 'CLOSED',
    lastMessage: '거래 감사합니다!',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    unreadCount: 0,
  },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    roomId: 'room-1',
    senderType: 'other',
    content: '안녕하세요! 번개장터입니다.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'msg-2',
    roomId: 'room-1',
    senderType: 'me',
    content: '네, 반갑습니다.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3 + 1000 * 60 * 2).toISOString(),
  },
  {
    id: 'msg-3',
    roomId: 'room-2',
    senderType: 'other',
    content: '혹시 오늘 발송 가능할까요?',
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: 'msg-4',
    roomId: 'room-2',
    senderType: 'me',
    content: '네! 송장 나오면 바로 알려드릴게요.',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'msg-5',
    roomId: 'room-3',
    senderType: 'other',
    content: '지금 연락 가능하실까요?',
    createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
  },
];
