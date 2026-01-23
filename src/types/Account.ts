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
}

export type SignupData = Omit<Account, 'id' | 'joinDate'> & { password: string };

export interface LoginData {
  email: string;
  password: string;
}

//  정규표현식 및 검사 로직 수정
export const VALIDATION_PATTERNS = {
  // 한글 또는 영문 2자 이상
  name: /^[가-힣a-zA-Z]{2,}$/,
  // 일반적인 이메일 형식
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // 영문,숫자,특수문자 조합 8자이상
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  // 하이픈 제외 숫자 11자리
  phone: /^010\d{8}$/,
  // 생년월일 8자리 (YYYYMMDD)
  birth: /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/,
  //닉네임 한글, 영문, 숫자 2~10자
  nickname: /^[가-힣a-zA-Z0-9]{2,10}$/,
};
