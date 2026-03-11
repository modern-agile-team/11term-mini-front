// 팔로우 목록에 들어갈 유저의 기본 정보 (any 대체)
export interface BaseUser {
  userId: string;
  nickname: string;
  imageUrl?: string;
}

export interface FollowData {
  followingList: BaseUser[];
  followerList: BaseUser[];
  followingCnt: number;
  followerCnt: number;
}

export interface Account {
  userId: string;
  name: string;
  nickname: string;
  address?: string;
  visitCount: number;
  createdAt: string;
  imageUrl?: string;
  follow?: FollowData;

  email?: string;
  phone?: string;
  shopIntro?: string;
  birth?: string;
  wishList?: string;
}

export type SignupData = Omit<
  Account,
  'userId' | 'createdAt' | 'visitCount' | 'imageUrl' | 'follow' | 'wishList'
> & {
  password: string;
};

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken?: string;
  token?: string;
  user?: Account;
}

export interface LoginResponse {
  data?: LoginResponseData;
  accessToken?: string;
  token?: string;
  user?: Account;
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
