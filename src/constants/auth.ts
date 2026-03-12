export const SOCIAL_PROVIDERS = [
  {
    id: 'kakao',
    label: '카카오로 이용하기',
    icon: '💬',
    color: 'hover:bg-[#FEE500] border-[#FEE500]',
    textColor: 'text-black',
    hoverText: 'group-hover:text-black',
  },
  {
    id: 'google',
    label: '구글로 이용하기',
    icon: 'G',
    color: 'hover:bg-gray-100',
    textColor: 'text-gray-600',
    hoverText: 'group-hover:text-black',
  },
  {
    id: 'naver',
    label: '네이버로 이용하기',
    icon: 'N',
    color: 'hover:bg-[#03C75A] border-[#03C75A]',
    textColor: 'text-[#03C75A]',
    hoverText: 'group-hover:text-white',
  },
] as const;

export const SIGNUP_FIELDS = [
  {
    name: 'userId',
    label: '아이디',
    placeholder: '영문, 숫자 4~12자',
    type: 'text',
  },
  {
    name: 'password',
    label: '비밀번호',
    placeholder: '영문, 숫자, 특수문자 조합 8자 이상',
    type: 'password',
  },
  {
    name: 'name',
    label: '이름',
    placeholder: '실명 입력',
    type: 'text',
  },
  {
    name: 'nickname',
    label: '닉네임',
    placeholder: '상점명으로 사용될 닉네임',
    type: 'text',
  },
  {
    name: 'address',
    label: '주소',
    placeholder: '시/군/구 단위 주소 입력',
    type: 'text',
  },
  {
    name: 'birth',
    label: '생년월일',
    placeholder: 'YYYYMMDD (8자리)',
    type: 'text',
  },
  {
    name: 'phone',
    label: '휴대폰번호',
    placeholder: '하이픈(-) 제외 11자리',
    type: 'text',
  },
] as const;
