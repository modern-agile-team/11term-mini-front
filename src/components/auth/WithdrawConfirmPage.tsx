import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const WithdrawConfirmPage = () => {
  const navigate = useNavigate();
  const { withdraw } = useAuth();

  const handleFinalWithdraw = async () => {
    // useAuth에 정의된 withdraw 함수 호출
    await withdraw();
  };

  return (
    <div className="max-w-[1024px] mx-auto min-h-screen bg-white flex flex-col">
      <div className="px-4 py-4">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="px-5 flex-1">
        <h1 className="text-2xl font-bold mb-6">탈퇴 전 유의사항</h1>
        <ul className="space-y-4 text-gray-500 text-[14px] leading-relaxed">
          <li className="flex gap-2">
            <span>•</span> 탈퇴 후 7일간 재가입이 불가능합니다.
          </li>
          <li className="flex gap-2">
            <span>•</span> 유료 구매한 아이템은 자동 소멸되며, 환불이 불가능합니다.
          </li>
          <li className="flex gap-2">
            <span>•</span> 탈퇴 시, 계정의 모든 정보는 삭제되며 재가입 시에도 복구되지 않습니다.
          </li>
          <li className="flex gap-2 text-red-500 font-medium">
            위 내용을 모두 확인하였으며, 이에 동의합니다.
          </li>
        </ul>
      </div>

      {/* 하단 고정 버튼 구역 */}
      <div className="p-4 flex gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex-1 py-4 bg-gray-100 text-gray-800 font-bold rounded-lg"
        >
          취소하기
        </button>
        <button
          onClick={handleFinalWithdraw}
          className="flex-1 py-4 bg-[#ff5058] text-white font-bold rounded-lg"
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default WithdrawConfirmPage;
