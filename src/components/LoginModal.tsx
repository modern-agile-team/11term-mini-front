import { useEffect } from 'react';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal = ({ onClose }: LoginModalProps) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      {/* 배경 클릭 시 닫기 */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-[428px] bg-white p-10 text-center shadow-2xl rounded-sm z-10">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-2xl text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          ✕
        </button>

        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-5">
            <span className="text-white text-2xl">⚡</span>
          </div>
          <h2 className="text-[22px] font-bold tracking-tight text-gray-900">
            번개장터로 중고거래 시작하기
          </h2>
          <p className="text-gray-500 mt-3 text-[15px]">간편하게 가입하고 상품을 확인하세요</p>
        </div>

        <div className="flex flex-col gap-3">
          <button className="h-[56px] border border-gray-200 flex items-center px-5 font-semibold text-[15px] hover:bg-gray-50 transition-colors cursor-pointer">
            <span className="w-8 text-xl text-[#FEE500]">💬</span>
            <span className="flex-1 text-center mr-8 text-black">카카오로 이용하기</span>
          </button>
          <button className="h-[56px] bg-[#1877F2] text-white flex items-center px-5 font-semibold text-[15px] hover:brightness-95 transition-all cursor-pointer">
            <span className="w-8 text-xl font-bold">f</span>
            <span className="flex-1 text-center mr-8">페이스북으로 이용하기</span>
          </button>
          <button className="h-[56px] bg-[#03C75A] text-white flex items-center px-5 font-semibold text-[15px] hover:brightness-95 transition-all cursor-pointer">
            <span className="w-8 text-xl font-bold">N</span>
            <span className="flex-1 text-center mr-8">네이버로 이용하기</span>
          </button>
          <button className="h-[56px] border border-gray-200 flex items-center px-5 font-semibold text-[15px] hover:bg-gray-50 transition-colors cursor-pointer">
            <span className="w-8 text-xl text-gray-400">📱</span>
            <span className="flex-1 text-center mr-8 text-black">본인인증으로 이용하기</span>
          </button>
        </div>

        <p className="mt-10 text-[12px] text-gray-400 leading-5">
          도움이 필요하면 <span className="underline cursor-pointer">이메일</span> 또는 고객센터{' '}
          <span className="font-bold text-gray-600">0000-0000</span>로 문의 부탁드립니다.
          <br />
          고객센터 운영시간: 09~18시 (점심시간 12~13시, 주말/공휴일 제외)
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
