// 검색 관련 설정
export const SEARCH_CONFIG = {
  MAX_RECENT_SEARCHES: 12, //
  PLACEHOLDER: '상품명, 지역명, @상점명 입력', //
  STORAGE_KEY: 'recentSearches', //
};

// 상단 유틸 메뉴 텍스트
export const HEADER_TEXT = {
  MY_GROUP: '내단체', //
  LOGOUT: '로그아웃', //
  LOGIN_SIGNUP: '로그인/회원가입', //
  SELLER_CENTER: '번개장터 판매자센터', //
  LOGO_TITLE: '번개장터',
};

// 메인 액션 메뉴 데이터 (아이콘/라벨/경로)
export const HEADER_ACTIONS = [
  { id: 'sell', label: '판매하기', icon: '💰', path: '/sell' }, //
  { id: 'myshop', label: '내상점', icon: '👤', path: '/mypage' }, //
  { id: 'chat', label: '번개톡', icon: '💬', path: '/chat' }, //
];
