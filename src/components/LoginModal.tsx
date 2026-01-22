import { useEffect, useState } from 'react';

interface LoginModalProps {
  onClose: () => void;
}

type LoginStep = 'SELECT' | 'LOGIN' | 'SIGNUP';

const LoginModal = ({ onClose }: LoginModalProps) => {
  const [step, setStep] = useState<LoginStep>('SELECT');
  const [isAllChecked, setIsAllChecked] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 overflow-y-auto py-10">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-[428px] bg-white p-10 shadow-2xl rounded-sm z-10 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-2xl text-gray-400 hover:text-gray-600 cursor-pointer z-20"
        >
          ✕
        </button>

        {/* STEP 1: 소셜 로그인 선택 화면 */}
        {step === 'SELECT' && (
          <div className="text-center">
            <div className="flex flex-col items-center mb-10">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-5 shadow-lg">
                <span className="text-white text-3xl">⚡</span>
              </div>
              <h2 className="text-[22px] font-bold tracking-tight text-gray-900">
                번개장터로 중고거래 시작하기
              </h2>
              <p className="text-gray-500 mt-3 text-[15px]">간편하게 가입하고 상품을 확인하세요</p>
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
                className="group h-[56px] border border-gray-200 flex items-center px-5 font-semibold text-[15px] hover:bg-[#888888] hover:border-[#888888] transition-all cursor-pointer"
              >
                <span className="w-8 text-xl group-hover:filter group-hover:brightness-0 group-hover:invert">
                  📱
                </span>
                <span className="flex-1 text-center mr-8 text-black group-hover:text-white">
                  본인인증으로 이용하기
                </span>
              </button>
            </div>

            <p className="mt-10 text-[12px] text-gray-400 leading-5">
              도움이 필요하면 <span className="underline cursor-pointer">이메일</span> 또는 고객센터{' '}
              <span className="font-bold text-gray-600">1670-2910</span>로 문의 부탁드립니다.
              <br />
              고객센터 운영시간: 09~18시 (점심시간 12~13시, 주말/공휴일 제외)
            </p>
          </div>
        )}

        {/* STEP 2: 로그인 화면  */}
        {step === 'LOGIN' && (
          <div className="text-left animate-in slide-in-from-right-4 duration-300">
            <button
              onClick={() => setStep('SELECT')}
              className="mb-4 text-gray-400 text-sm hover:text-black transition-colors"
            >
              ← 이전으로
            </button>
            <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">로그인</h2>

            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="이메일"
                className="w-full h-12 px-4 border border-gray-200 outline-none focus:border-black transition-colors text-black"
              />
              <input
                type="password"
                placeholder="비밀번호"
                className="w-full h-12 px-4 border border-gray-200 outline-none focus:border-black transition-colors text-black"
              />
              <button className="w-full h-14 bg-[#ff5058] text-white font-bold rounded-sm mt-2 text-lg hover:bg-[#e64951] transition-colors">
                로그인
              </button>
              <div className="flex justify-center gap-4 text-sm text-gray-400 mt-4">
                <span className="cursor-pointer hover:underline">비밀번호 찾기</span>
                <span>|</span>
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

        {/* STEP 3: 회원가입 화면  */}
        {step === 'SIGNUP' && (
          <div className="text-left animate-in slide-in-from-right-4 duration-300">
            <button
              onClick={() => setStep('LOGIN')}
              className="mb-4 text-gray-400 text-sm hover:text-black"
            >
              ← 로그인으로
            </button>
            <h2 className="text-2xl font-bold mb-8 text-gray-800">본인 정보를 입력해주세요</h2>

            <form className="flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>
              <div className="border-b border-gray-200 pb-2">
                <label className="text-[11px] font-bold text-gray-400">이름</label>
                <input
                  type="text"
                  placeholder="이름"
                  className="w-full outline-none text-lg text-black"
                />
              </div>
              <div className="flex items-end gap-3 border-b border-gray-200 pb-2">
                <div className="flex-[1.2]">
                  <label className="text-[11px] font-bold text-gray-400">생년월일</label>
                  <input
                    type="text"
                    placeholder="YYYYMMDD"
                    maxLength={8}
                    className="w-full outline-none text-lg text-black"
                  />
                </div>
                <span className="text-gray-300 text-xl">-</span>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="password"
                    maxLength={1}
                    className="w-8 outline-none text-lg border-b border-gray-800 text-center text-black"
                  />
                  <div className="flex gap-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 bg-gray-600 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <label className="text-[11px] font-bold text-gray-400">휴대폰번호</label>
                <input
                  type="text"
                  placeholder="숫자만 입력"
                  className="w-full outline-none text-lg text-black"
                />
              </div>

              <div
                className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-sm cursor-pointer mt-2"
                onClick={() => setIsAllChecked(!isAllChecked)}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${isAllChecked ? 'bg-[#ff5058] border-[#ff5058]' : 'bg-white border-gray-200'}`}
                >
                  <span className="text-white text-[10px]">✓</span>
                </div>
                <span className="font-bold text-gray-800 text-sm">전체동의</span>
              </div>

              <button
                type="button"
                className={`w-full h-14 font-bold rounded-sm mt-4 text-lg transition-all ${
                  isAllChecked
                    ? 'bg-[#ff5058] text-white'
                    : 'bg-[#ff5058]/30 text-white cursor-not-allowed'
                }`}
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
