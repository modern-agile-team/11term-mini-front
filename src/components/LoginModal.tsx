import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SOCIAL_PROVIDERS, SIGNUP_FIELDS } from '../constants/auth';
import { AuthField } from './auth/AuthField';
import { useAuthForm } from '../hooks/useAuthForm';
import { useAuth } from '../hooks/useAuth';
import type { FormEvent } from 'react';
import api from '../api/axios';

const STYLES = {
  input: 'w-full h-12 px-4 border border-gray-200 outline-none focus:border-black transition-all',
  submitBtn: 'w-full h-14 font-bold rounded-sm mt-2 text-lg transition-all',
  socialBtn:
    'group h-[56px] border border-gray-200 flex items-center px-5 font-semibold text-[15px] transition-all cursor-pointer',
  checkBtn: 'whitespace-nowrap px-3 py-1 border text-xs transition-all',
  activeBtn: 'bg-[#ff5058] text-white shadow-lg',
  inactiveBtn: 'bg-gray-200 text-gray-400 cursor-not-allowed',
};

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<'SELECT' | 'LOGIN' | 'SIGNUP'>('SELECT');
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const { formData, errors, handleChange } = useAuthForm();

  // 스크롤 제어
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 회원가입 버튼 활성화 여부 계산
  const isSignupValid = useMemo(
    () =>
      isAllChecked &&
      isNicknameChecked &&
      !Object.values(errors).some((e) => e) &&
      !!(formData.email && formData.password && formData.nickname && formData.name),
    [isAllChecked, isNicknameChecked, errors, formData],
  );

  if (!isOpen) return null;
  // 핸들러 함수들
  const handleNicknameCheck = async () => {
    if (!formData.nickname || errors.nickname) return alert('올바른 닉네임을 입력해주세요.');
    try {
      const { data } = await api.get(`/api/auth/check?nickname=${formData.nickname}`);
      if (data.isDuplicate) {
        alert('이미 사용 중인 닉네임입니다.');
        setIsNicknameChecked(false);
      } else {
        alert('사용 가능한 닉네임입니다.');
        setIsNicknameChecked(true);
      }
    } catch {
      alert('중복 체크 중 오류가 발생했습니다.');
    }
  };

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login({ email: formData.email, password: formData.password });
      onClose();
      navigate('/mypage');
    } catch {
      alert('정보가 일치하지 않습니다.');
    }
  };

  const onSignup = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/signup', formData);
      alert('가입 완료!');
      setStep('LOGIN');
    } catch {
      alert('이미 가입된 이메일입니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 py-10 px-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-107 bg-white p-6 md:p-10 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-2xl text-gray-400 hover:text-black transition-colors"
        >
          ✕
        </button>

        {step === 'SELECT' && (
          <div className="text-center">
            <div className="mb-10 flex flex-col items-center">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-5">
                <span className="text-white text-3xl">⚡</span>
              </div>
              <h2 className="text-[22px] font-bold">번개장터로 중고거래 시작하기</h2>
            </div>
            <div className="flex flex-col gap-3">
              {SOCIAL_PROVIDERS.map((p) => (
                <button key={p.id} className={`${STYLES.socialBtn} ${p.color}`}>
                  <span
                    className={`w-8 text-xl ${p.textColor} group-hover:invert group-hover:brightness-0`}
                  >
                    {p.icon}
                  </span>
                  <span className={`flex-1 text-center mr-8 ${p.hoverText}`}>{p.label}</span>
                </button>
              ))}
              <button
                onClick={() => setStep('LOGIN')}
                className={`${STYLES.socialBtn} hover:bg-gray-100 mt-2`}
              >
                <span className="w-8 text-xl">📱</span>
                <span className="flex-1 text-center mr-8">본인인증으로 이용하기</span>
              </button>
            </div>
          </div>
        )}

        {step === 'LOGIN' && (
          <form onSubmit={onLogin}>
            <button
              type="button"
              onClick={() => setStep('SELECT')}
              className="mb-4 text-gray-400 text-sm hover:text-black transition-colors"
            >
              ← 이전
            </button>
            <h2 className="text-2xl font-bold mb-8 text-center">로그인</h2>
            <div className="flex flex-col gap-4">
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일"
                className={STYLES.input}
              />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호"
                className={STYLES.input}
              />
              <button
                type="submit"
                className={`${STYLES.submitBtn} bg-[#ff5058] text-white hover:bg-[#e64951]`}
              >
                로그인
              </button>
              <span
                onClick={() => setStep('SIGNUP')}
                className="mt-4 text-center cursor-pointer font-bold hover:underline block"
              >
                회원가입
              </span>
            </div>
          </form>
        )}

        {step === 'SIGNUP' && (
          <form onSubmit={onSignup} className="flex flex-col gap-5">
            <button
              type="button"
              onClick={() => setStep('LOGIN')}
              className="text-gray-400 text-sm hover:text-black transition-colors"
            >
              ← 로그인으로
            </button>
            <h2 className="text-2xl font-bold mb-4">정보를 입력해주세요</h2>

            <AuthField label="닉네임" error={errors.nickname}>
              <div className="flex items-center gap-2">
                <input
                  name="nickname"
                  value={formData.nickname}
                  onChange={(e) => {
                    handleChange(e);
                    setIsNicknameChecked(false);
                  }}
                  placeholder="닉네임 입력 (2~10자)"
                  className="w-full outline-none text-lg"
                />
                <button
                  type="button"
                  onClick={handleNicknameCheck}
                  className={`${STYLES.checkBtn} ${isNicknameChecked ? 'bg-blue-500 border-blue-500 text-white' : 'border-black hover:bg-black hover:text-white'}`}
                >
                  {isNicknameChecked ? '확인됨' : '중복확인'}
                </button>
              </div>
            </AuthField>

            {SIGNUP_FIELDS.map((f) => (
              <AuthField key={f.name} label={f.label} error={errors[f.name as keyof typeof errors]}>
                <input
                  {...f}
                  value={formData[f.name as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full outline-none text-lg"
                />
              </AuthField>
            ))}

            <div
              onClick={() => setIsAllChecked(!isAllChecked)}
              className="flex items-center gap-3 p-4 bg-gray-50 border cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border ${isAllChecked ? 'bg-[#ff5058] border-[#ff5058]' : 'bg-white'}`}
              >
                <span className="text-white text-[10px]">✓</span>
              </div>
              <span className="font-bold text-sm">전체동의</span>
            </div>

            <button
              type="submit"
              disabled={!isSignupValid}
              className={`${STYLES.submitBtn} ${isSignupValid ? STYLES.activeBtn : STYLES.inactiveBtn}`}
            >
              회원가입 완료
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
