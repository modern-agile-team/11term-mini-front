export const SOCIAL_PROVIDERS = [
  {
    id: 'kakao',
    label: '카카오로 이용하기',
    icon: '💬',
    color: 'hover:bg-[#3c1e1e]',
    textColor: 'text-black',
    hoverText: 'group-hover:text-white',
  },
  {
    id: 'facebook',
    label: '페이스북으로 이용하기',
    icon: 'f',
    color: 'hover:bg-[#1877F2]',
    textColor: 'text-[#1877F2]',
    hoverText: 'group-hover:text-white',
  },
  {
    id: 'naver',
    label: '네이버로 이용하기',
    icon: 'N',
    color: 'hover:bg-[#03C75A]',
    textColor: 'text-[#03C75A]',
    hoverText: 'group-hover:text-white',
  },
] as const;

export const SIGNUP_FIELDS = [
  { name: 'name', label: '이름', placeholder: '이름', type: 'text' },
  { name: 'email', label: '이메일 (ID)', placeholder: 'example@email.com', type: 'email' },
  {
    name: 'password',
    label: '비밀번호',
    placeholder: '영문, 숫자, 특수문자 조합 8자 이상',
    type: 'password',
  },
  { name: 'birth', label: '생년월일', placeholder: '생년월일 8자리 (YYYYMMDD)', type: 'text' },
  { name: 'phone', label: '휴대폰번호', placeholder: '01012345678', type: 'text' },
] as const;
