import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const REASONS = [
  '찾는 물품이 없어요',
  '물품이 안 팔려요',
  '비매너 사용자를 만났어요',
  '새 상점을 만들고 싶어요',
  '개인정보를 삭제하고 싶어요',
  '기타',
];

const WithdrawReasonPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1024px] mx-auto min-h-screen bg-white">
      <div className="flex items-center px-4 py-4">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="px-5 py-6">
        <h1 className="text-2xl font-bold mb-8">탈퇴 사유가 무엇인가요?</h1>
        <div className="space-y-1">
          {REASONS.map((reason) => (
            <button
              key={reason}
              onClick={() => navigate('/settings/withdraw/confirm', { state: { reason } })}
              className="w-full flex items-center justify-between py-5 border-b border-gray-50 hover:bg-gray-50"
            >
              <span className="text-[16px] text-gray-800">{reason}</span>
              <ChevronRight size={20} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WithdrawReasonPage;
