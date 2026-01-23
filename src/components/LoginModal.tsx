import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Account } from '../types/Account';
import { VALIDATION_PATTERNS } from '../types/Account';

interface LoginModalProps {
  onClose: () => void;
}

type LoginStep = 'SELECT' | 'LOGIN' | 'SIGNUP';

const LoginModal = ({ onClose }: LoginModalProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<LoginStep>('SELECT');
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

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
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    let error = '';
    if (name === 'email' && !VALIDATION_PATTERNS.email.test(value))
      error = '올바른 이메일 형식이 아닙니다.';
    if (name === 'password' && !VALIDATION_PATTERNS.password.test(value))
      error = '8자 이상, 영문/숫자/특수문자 조합이 필요합니다.';
    if (name === 'name' && !VALIDATION_PATTERNS.name.test(value))
      error = '이름을 2자 이상 입력해주세요.';
    if (name === 'nickname' && !VALIDATION_PATTERNS.nickname.test(value)) {
      error = '2~10자 한글, 영문, 숫자만 가능합니다.';
      setIsNicknameChecked(false);
    }
    if (name === 'phone' && !VALIDATION_PATTERNS.phone.test(value))
      error = '010으로 시작하는 11자리 숫자를 입력해주세요.';

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleNicknameCheck = () => {
    if (!formData.nickname || errors.nickname) {
      alert('올바른 닉네임을 입력해주세요.');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const isDuplicate = users.some((u: Account) => u.nickname === formData.nickname);

    if (isDuplicate) {
      alert('이미 사용 중인 닉네임입니다.');
      setIsNicknameChecked(false);
    } else {
      alert('사용 가능한 닉네임입니다.');
      setIsNicknameChecked(true);
    }
  };

  const handleSignup = () => {
    if (!isNicknameChecked) {
      alert('닉네임 중복 확인이 필요합니다.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u: Account) => u.email === formData.email)) {
      alert('이미 가입된 이메일입니다.');
      return;
    }

    const newAccount: Account = {
      id: Date.now().toString(),
      email: formData.email,
      name: formData.name,
      nickname: formData.nickname,
      phone: formData.phone,
      birth: formData.birth,
      joinDate: new Date().toLocaleDateString(),
    };

    localStorage.setItem(
      'users',
      JSON.stringify([...users, { ...newAccount, password: formData.password }]),
    );
    alert('회원가입이 완료되었습니다!');
    setStep('LOGIN');
  };

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find(
      (u: Account & { password: string }) =>
        u.email === formData.email && u.password === formData.password,
    );

    if (user) {
      const accountInfo = { ...user };
      delete accountInfo.password;

      localStorage.setItem('currentUser', JSON.stringify(accountInfo));
      window.dispatchEvent(new Event('auth-change'));
      onClose();
      navigate('/mypage');
    } else {
      alert('정보가 일치하지 않습니다.');
    }
  };

  const isSignupValid =
    isAllChecked &&
    isNicknameChecked &&
    !Object.values(errors).some((e) => e !== '') &&
    formData.email &&
    formData.password;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 overflow-y-auto py-10">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative w-[428px] bg-white p-10 shadow-2xl rounded-sm z-10">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-2xl text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {step === 'SELECT' && (
          <div className="text-center">
            <div className="flex flex-col items-center mb-10">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-5">
                <span className="text-white text-3xl">⚡</span>
              </div>
              <h2 className="text-[22px] font-bold text-gray-900">번개장터로 중고거래 시작하기</h2>
            </div>
            <div className="flex flex-col gap-3">
              {/* 카카오 */}
              <button className="group h-[56px] border border-gray-200 flex items-center px-5 font-semibold text-[15px] hover:bg-[#3c1e1e] hover:border-[#3c1e1e] transition-all cursor-pointer">
                <span className="w-8 text-xl group-hover:filter group-hover:brightness-0 group-hover:invert">
                  💬
                </span>
                <span className="flex-1 text-center mr-8 text-black group-hover:text-white">
                  카카오로 이용하기
                </span>
              </button>
              {/* 페이스북 */}
              <button className="group h-[56px] border border-gray-200 flex items-center px-5 font-semibold text-[15px] hover:bg-[#1877F2] hover:border-[#1877F2] transition-all cursor-pointer">
                <span className="w-8 text-xl font-bold text-[#1877F2] group-hover:text-white">
                  f
                </span>
                <span className="flex-1 text-center mr-8 text-black group-hover:text-white">
                  페이스북으로 이용하기
                </span>
              </button>
              {/* 네이버 */}
              <button className="group h-[56px] border border-gray-200 flex items-center px-5 font-semibold text-[15px] hover:bg-[#03C75A] hover:border-[#03C75A] transition-all cursor-pointer">
                <span className="w-8 text-xl font-bold text-[#03C75A] group-hover:text-white">
                  N
                </span>
                <span className="flex-1 text-center mr-8 text-black group-hover:text-white">
                  네이버로 이용하기
                </span>
              </button>
              {/* 본인인증 */}
              <button
                onClick={() => setStep('LOGIN')}
                className="group h-[56px] border border-gray-200 flex items-center px-5 font-semibold text-[15px] hover:bg-gray-100 transition-all cursor-pointer mt-2"
              >
                <span className="w-8 text-xl text-gray-400">📱</span>
                <span className="flex-1 text-center mr-8 text-black">본인인증으로 이용하기</span>
              </button>
            </div>
          </div>
        )}

        {step === 'LOGIN' && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <button onClick={() => setStep('SELECT')} className="mb-4 text-gray-400 text-sm">
              ← 이전으로
            </button>
            <h2 className="text-2xl font-bold mb-8 text-center">로그인</h2>
            <div className="flex flex-col gap-4">
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일"
                className="w-full h-12 px-4 border border-gray-200 outline-none focus:border-black"
              />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호"
                className="w-full h-12 px-4 border border-gray-200 outline-none focus:border-black"
              />
              <button
                onClick={handleLogin}
                className="w-full h-14 bg-[#ff5058] text-white font-bold text-lg"
              >
                로그인
              </button>
              <div className="text-center mt-4">
                <span
                  onClick={() => setStep('SIGNUP')}
                  className="cursor-pointer text-black font-bold hover:underline"
                >
                  회원가입
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 'SIGNUP' && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <button onClick={() => setStep('LOGIN')} className="mb-4 text-gray-400 text-sm">
              ← 로그인으로
            </button>
            <h2 className="text-2xl font-bold mb-8">정보를 입력해주세요</h2>
            <form className="flex flex-col gap-5">
              <div className="border-b border-gray-200 pb-2">
                <label className="text-[11px] font-bold text-gray-400">이름</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름"
                  className="w-full outline-none text-lg"
                />
              </div>

              <div className="border-b border-gray-200 pb-2">
                <label className="text-[11px] font-bold text-gray-400">닉네임</label>
                <div className="flex items-center gap-2">
                  <input
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    placeholder="닉네임 입력 (2~10자)"
                    className="w-full outline-none text-lg"
                  />
                  <button
                    type="button"
                    onClick={handleNicknameCheck}
                    className="whitespace-nowrap px-3 py-1 border border-black text-xs hover:bg-black hover:text-white transition-all"
                  >
                    중복확인
                  </button>
                </div>
                {errors.nickname && (
                  <p className="text-[10px] text-red-500 mt-1">{errors.nickname}</p>
                )}
                {isNicknameChecked && (
                  <p className="text-[10px] text-blue-500 mt-1">사용 가능한 닉네임입니다.</p>
                )}
              </div>

              <div className="border-b border-gray-200 pb-2">
                <label className="text-[11px] font-bold text-gray-400">이메일 (ID)</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full outline-none text-lg"
                />
              </div>

              <div className="border-b border-gray-200 pb-2">
                <label className="text-[11px] font-bold text-gray-400">비밀번호</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="영문, 숫자, 특수문자 조합 8자 이상"
                  className="w-full outline-none text-lg"
                />
              </div>

              <div className="border-b border-gray-200 pb-2">
                <label className="text-[11px] font-bold text-gray-200 pb-2">생년월일</label>
                <input
                  name="birth"
                  type="birth"
                  value={formData.birth}
                  onChange={handleChange}
                  placeholder="생년월일 8자리 (YYYYMMDD)"
                  className="w-full ouline-none text-lg"
                />
              </div>

              <div className="border-b border-gray-200 pb-2">
                <label className="text-[11px] font-bold text-gray-400">휴대폰번호</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01012345678"
                  className="w-full outline-none text-lg"
                />
              </div>

              <div
                onClick={() => setIsAllChecked(!isAllChecked)}
                className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-sm cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border ${isAllChecked ? 'bg-[#ff5058] border-[#ff5058]' : 'bg-white border-gray-200'}`}
                >
                  <span className="text-white text-[10px]">✓</span>
                </div>
                <span className="font-bold text-gray-800 text-sm">전체동의</span>
              </div>

              <button
                type="button"
                onClick={handleSignup}
                disabled={!isSignupValid}
                className={`w-full h-14 font-bold rounded-sm mt-2 text-lg transition-all ${isSignupValid ? 'bg-[#ff5058] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                회원가입 완료
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
