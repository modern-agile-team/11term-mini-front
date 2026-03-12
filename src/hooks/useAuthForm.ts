import { useState } from 'react';
import { VALIDATION_PATTERNS } from '../types/Account';

export const useAuthForm = () => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    name: '',
    nickname: '',
    address: '',
    phone: '',
    birth: '',
  });

  const [errors, setErrors] = useState({
    userId: '',
    password: '',
    name: '',
    nickname: '',
    address: '',
    phone: '',
    birth: '',
  });

  const validateField = (name: string, value: string) => {
    if (!value) return '';

    switch (name) {
      case 'userId':
        return /^[a-zA-Z0-9]{4,12}$/.test(value)
          ? ''
          : '아이디는 영문, 숫자 조합 4~12자리로 입력해주세요.';
      case 'password':
        return VALIDATION_PATTERNS.password.test(value)
          ? ''
          : '영문, 숫자, 특수문자 조합 8자 이상 입력해주세요.';
      case 'name':
        return VALIDATION_PATTERNS.name.test(value) ? '' : '이름을 2자 이상 입력해주세요.';
      case 'nickname':
        return VALIDATION_PATTERNS.nickname.test(value) ? '' : '닉네임은 2~10자로 입력해주세요.';
      case 'address':
        return value.length >= 2 ? '' : '주소를 정확히 입력해주세요.';
      case 'phone':
        return VALIDATION_PATTERNS.phone.test(value) ? '' : '휴대폰 번호를 정확히 입력해주세요.';
      case 'birth':
        return VALIDATION_PATTERNS.birth.test(value) ? '' : '생년월일 8자리를 입력해주세요.';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  return { formData, setFormData, errors, handleChange };
};
