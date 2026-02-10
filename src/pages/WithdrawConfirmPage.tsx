import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const WithdrawConfirmPage = () => {
  const navigate = useNavigate();
  const { withdraw } = useAuth();
  const location = useLocation();
  const reason = location.state?.reason || '기타';

  const handleFinalWithdraw = async () => {
    await withdraw();
  };

  return (
    <div className="max-w-[1024px] mx-auto min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center px-4 py-4 border-b border-gray-50">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-7">탈퇴 유의사항</h1>
      </div>

      <div className="px-5 py-8 flex-1">
        <h2 className="text-xl font-bold mb-6">탈퇴 전 유의사항</h2>
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <p className="text-sm text-gray-600">
            선택하신 탈퇴 사유: <span className="font-bold text-gray-900">{reason}</span>
          </p>
        </div>

        <ul className="space-y-5 text-[14px] text-gray-500 leading-relaxed">
          <li className="flex gap-2">
            <span>•</span> 탈퇴 후 7일간 재가입이 불가능합니다.
          </li>
          <li className="flex gap-2">
            <span>•</span> 유료 구매한 아이템은 자동 소멸되며, 환불이 불가능합니다.
          </li>
          <li className="flex gap-2">
            <span>•</span> 탈퇴 시, 계정의 모든 정보는 삭제되며 복구되지 않습니다.
          </li>
          <li className="flex gap-2 font-medium text-gray-700">
            <span>•</span> 사용하지 않은 번개포인트는 모두 소멸됩니다.
          </li>
          <li className="mt-10 text-[#ff5058] font-bold text-[15px]">
            ※ 위 내용을 모두 확인하였으며, 탈퇴에 동의합니다.
          </li>
        </ul>
      </div>

      {/* 하단 버튼 */}
      <div className="p-4 flex gap-3 border-t border-gray-100">
        <button
          onClick={() => navigate('/settings')}
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
