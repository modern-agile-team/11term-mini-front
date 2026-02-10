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
      <div className="flex items-center px-4 py-4 border-b border-gray-50">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-7">탈퇴 유의사항</h1>
      </div>

      <div className="px-5 py-8 flex-1">
        <h2 className="text-xl font-bold mb-6">탈퇴 전 유의사항</h2>

        {/* 이 부분이 return 안으로 들어와야 화면에 보입니다! */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600">
            선택하신 탈퇴 사유: <span className="font-bold text-gray-900">{reason}</span>
          </p>
        </div>

        <ul className="space-y-4 text-[14px] text-gray-500 leading-relaxed">
          {/* ... 유의사항 리스트 ... */}
          <li className="mt-8 text-red-500 font-bold">
            ※ 위 내용을 모두 확인하였으며, 탈퇴에 동의합니다.
          </li>
        </ul>
      </div>

      {/* ... 하단 버튼 구역 ... */}
    </div>
  );
};
