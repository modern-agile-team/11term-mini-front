export interface Account {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar?: string;
  joinDate: string;
  birth: string;
  nickname: string;
  shopIntro?: string;
  wishList: string;
  createdAt: string;
  imageUrl: string;
}

export type SignupData = Omit<Account, 'id' | 'joinDate' | 'createdAt' | 'wishList'> & {
  password: string;
};

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: Account;
}

export const VALIDATION_PATTERNS = {
  // 이름: 한글 또는 영문 2자 이상 (중간 공백 및 하이픈 허용)
  name: /^[가-힣a-zA-Z]{1,}[가-힣a-zA-Z\s-]{1,}$/,
  // 이메일: 표준적인 이메일 형식
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // 비밀번호: 영문, 숫자, 특수문자 조합 8자 이상
  password:
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+|~=`{}[\]:";'<>?,./])[A-Za-z\d!@#$%^&*()_+|~=`{}[\]:";'<>?,./]{8,}$/,
  // 전화번호: 하이픈 제외 숫자 11자리 (010으로 시작)
  phone: /^010\d{8}$/,
  // 생년월일: YYYYMMDD 형식 8자리
  birth: /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/,
  // 닉네임: 한글, 영문, 숫자 조합 2~10자
  nickname: /^[가-힣a-zA-Z0-9]{2,10}$/,
};
