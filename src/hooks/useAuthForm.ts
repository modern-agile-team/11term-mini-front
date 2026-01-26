import { useState, useCallback } from 'react';
import { VALIDATION_PATTERNS } from '../types/Account';

export const useAuthForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    nickname: '',
    phone: '',
    birth: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: '',
    nickname: '',
    phone: '',
    birth: '',
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const pattern = VALIDATION_PATTERNS[name as keyof typeof VALIDATION_PATTERNS];
    let error = '';

    if (pattern && !pattern.test(value)) {
      const messages: Record<string, string> = {
        email: '올바른 이메일 형식이 아닙니다.',
        password: '8자 이상, 영문/숫자/특수문자 조합이 필요합니다.',
        name: '이름을 2자 이상 입력해주세요.',
        nickname: '2~10자 한글, 영문, 숫자만 가능합니다.',
        phone: '010으로 시작하는 11자리 숫자를 입력해주세요.',
      };
      error = messages[name] || '';
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  return { formData, setFormData, errors, handleChange };
};
