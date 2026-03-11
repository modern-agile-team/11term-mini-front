export interface FollowSummary {
  userId: string;
  nickname: string;
  imageUrl?: string;
}

export interface FollowData {
  followingList: FollowSummary[];
  followerList: FollowSummary[];
  followingCnt: number;
  followerCnt: number;
}

export interface Account {
  userId: string;
  name: string;
  nickname: string;
  address: string;
  visitCount: number;
  createdAt: string;
  imageUrl: string;
  follow?: FollowData;
  email?: string;
  phone?: string;
  birth?: string;
  shopIntro?: string;
}

// 회원가입 데이터
export type SignupData = Pick<Account, 'userId' | 'name' | 'nickname' | 'address'> & {
  password: string;
};

// 로그인 데이터
export interface LoginData {
  userId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: Account;
}

export const VALIDATION_PATTERNS = {
  // 이름: 한글 또는 영문 2자 이상
  name: /^[가-힣a-zA-Z]{2,}[가-힣a-zA-Z\s-]*$/,
  // 이메일: 표준 형식 (필요 시 사용)
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // 비밀번호: 영문, 숫자, 특수문자 조합 8자 이상
  password:
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+|~=`{}[\]:";'<>?,./])[A-Za-z\d!@#$%^&*()_+|~=`{}[\]:";'<>?,./]{8,}$/,
  // 전화번호: 010으로 시작하는 11자리
  phone: /^010\d{8}$/,
  // 생년월일: YYYYMMDD
  birth: /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/,
  // 닉네임: 한글, 영문, 숫자 조합 2~10자
  nickname: /^[가-힣a-zA-Z0-9]{2,10}$/,
};
