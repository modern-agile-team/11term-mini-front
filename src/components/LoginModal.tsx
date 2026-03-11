import { useState, useMemo } from 'react';
import { SOCIAL_PROVIDERS, SIGNUP_FIELDS } from '../constants/auth';
import { AuthField } from './auth/AuthField';
import { useAuthForm } from '../hooks/useAuthForm';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import { isAxiosError } from 'axios';

const STYLES = {
  input: 'w-full h-12 px-4 border border-gray-200 outline-none focus:border-black transition-all',
  submitBtn: 'w-full h-14 font-bold rounded-sm mt-2 text-lg transition-all',
  socialBtn:
    'group h-[56px] border border-gray-200 flex items-center px-5 font-semibold text-[15px] transition-all cursor-pointer',
  checkBtn: 'whitespace-nowrap px-3 py-1 border text-xs transition-all',
  activeBtn: 'bg-[#ff5058] text-white shadow-lg hover:bg-[#e04048]',
  inactiveBtn: 'bg-gray-200 text-gray-400 cursor-not-allowed',
};

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { login } = useAuth();
  const [step, setStep] = useState<'SELECT' | 'LOGIN' | 'SIGNUP'>('SELECT');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const { formData, errors, handleChange, setFormData } = useAuthForm();

  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);

  // 로그인 핸들러
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return alert('이메일과 비밀번호를 입력해주세요.');

    const isSuccess = await login({ email: loginEmail, password: loginPassword });
    if (isSuccess) {
      onClose();
    }
  };

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    if (errors.nickname || !formData.nickname) {
      return alert('올바른 닉네임을 먼저 입력해주세요.');
    }
    try {
      await api.post('/api/auth/check-nickname', { nickname: formData.nickname });
      setIsNicknameChecked(true);
      alert('사용 가능한 닉네임입니다.');
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        alert(error.response?.data?.message || '이미 사용중인 닉네임입니다.');
      } else {
        alert('닉네임 확인 중 오류가 발생했습니다.');
      }
      setIsNicknameChecked(false);
    }
  };

  // 회원가입 처리
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/signup', formData);
      alert('회원가입이 완료되었습니다! 로그인 해주세요.');

      setFormData({ email: '', password: '', name: '', nickname: '', phone: '', birth: '' });
      setIsNicknameChecked(false);
      setIsAllChecked(false);
      setStep('LOGIN');
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        alert(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const isSignupValid = useMemo(() => {
    const hasNoErrors = Object.values(errors).every((err) => err === '');
    const hasAllValues = Object.values(formData).every((val) => val !== '');
    return hasNoErrors && hasAllValues && isNicknameChecked && isAllChecked;
  }, [errors, formData, isNicknameChecked, isAllChecked]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-[400px] rounded-lg shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors z-10"
        >
          ✕
        </button>

        {step === 'SELECT' && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8">번개장터로 중고거래 시작하기</h2>
            <div className="flex flex-col gap-3">
              {SOCIAL_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() =>
                    p.label.includes('이메일') ? setStep('LOGIN') : alert('준비중입니다.')
                  }
                  className={`${STYLES.socialBtn} ${p.color} ${p.textColor || ''} ${p.hoverText || ''}`}
                >
                  <span className="mr-3 text-lg">{p.icon}</span>
                  <span className="flex-1 text-center pr-6">{p.label}</span>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-8">
              도움이 필요하시면 <span className="underline cursor-pointer">이메일 문의</span>를
              이용해주세요.
            </p>
          </div>
        )}

        {step === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-center">이메일 로그인</h2>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="이메일"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className={STYLES.input}
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={STYLES.input}
              />
            </div>
            <button
              type="submit"
              className={`${STYLES.submitBtn} ${loginEmail && loginPassword ? STYLES.activeBtn : STYLES.inactiveBtn}`}
            >
              로그인
            </button>
            <div className="flex justify-center gap-4 text-sm text-gray-500 mt-2">
              <button
                type="button"
                onClick={() => setStep('SIGNUP')}
                className="hover:text-black font-semibold transition-colors"
              >
                이메일 가입
              </button>
              <span>|</span>
              <button type="button" className="hover:text-black transition-colors">
                비밀번호 찾기
              </button>
            </div>
          </form>
        )}

        {step === 'SIGNUP' && (
          <form
            onSubmit={handleSignupSubmit}
            className="p-8 flex flex-col gap-5 max-h-[80vh] overflow-y-auto custom-scrollbar"
          >
            <h2 className="text-2xl font-bold text-center mb-4">회원가입</h2>

            <AuthField label="닉네임" error={errors.nickname}>
              <div className="flex gap-2">
                <input
                  name="nickname"
                  value={formData.nickname}
                  onChange={(e) => {
                    handleChange(e);
                    setIsNicknameChecked(false);
                  }}
                  className="w-full outline-none text-lg"
                  placeholder="2~10자"
                />
                <button
                  type="button"
                  onClick={handleNicknameCheck}
                  className={`${STYLES.checkBtn} ${isNicknameChecked ? 'bg-black text-white' : 'hover:bg-gray-800 hover:text-white'}`}
                >
                  {isNicknameChecked ? '확인됨' : '중복확인'}
                </button>
              </div>
            </AuthField>

            {SIGNUP_FIELDS.map((f) => {
              const fieldName = f.name as keyof typeof formData;
              const fieldError = errors[fieldName as keyof typeof errors];

              return (
                <AuthField key={f.name} label={f.label} error={fieldError}>
                  <input
                    {...f}
                    name={fieldName}
                    value={formData[fieldName]}
                    onChange={handleChange}
                    className="w-full outline-none text-lg"
                  />
                </AuthField>
              );
            })}

            <div
              onClick={() => setIsAllChecked(!isAllChecked)}
              className="flex items-center gap-3 p-4 bg-gray-50 border cursor-pointer hover:bg-gray-100 transition-colors mt-2"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${isAllChecked ? 'bg-[#ff5058] border-[#ff5058]' : 'bg-white'}`}
              >
                <span className="text-white text-[10px]">✓</span>
              </div>
              <span className="font-bold text-sm text-gray-700">전체동의</span>
            </div>

            <button
              type="submit"
              disabled={!isSignupValid}
              className={`${STYLES.submitBtn} ${isSignupValid ? STYLES.activeBtn : STYLES.inactiveBtn}`}
            >
              회원가입 완료
            </button>

            <button
              type="button"
              onClick={() => setStep('LOGIN')}
              className="text-sm text-gray-500 hover:text-black text-center mt-2 transition-colors"
            >
              이미 계정이 있으신가요? 로그인
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
