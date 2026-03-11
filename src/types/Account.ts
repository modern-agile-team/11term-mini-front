export interface Account {
  id: number;
  email: string;
  name: string;
  phone: string;
  nickname: string;
  role: string;
  createdAt: string;
  updatedAt: string;

  avatar?: string;
  joinDate?: string;
  birth?: string;
  shopIntro?: string;
  wishList?: string;
}

export type SignupData = Omit<
  Account,
  'id' | 'joinDate' | 'createdAt' | 'updatedAt' | 'role' | 'wishList'
> & {
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
  name: /^[가-힣a-zA-Z]{1,}[가-힣a-zA-Z\s-]{1,}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password:
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+|~=`{}[\]:";'<>?,./])[A-Za-z\d!@#$%^&*()_+|~=`{}[\]:";'<>?,./]{8,}$/,
  phone: /^010\d{8}$/,
  birth: /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/,
  nickname: /^[가-힣a-zA-Z0-9]{2,10}$/,
};
