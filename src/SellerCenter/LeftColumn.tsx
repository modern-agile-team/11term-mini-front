export const LeftColumn = () => {
  const grades = ['WHITE', 'BRONZE', 'SILVER', 'GOLD', 'DIAMOND'];

  return (
    <div className="col-span-4 flex flex-col gap-6">
      {/* 광고주 등급제 */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold">광고주 등급제 혜택</h3>
          <button className="text-xs border border-gray-300 px-2 py-1 rounded text-gray-500">
            혜택보기
          </button>
        </div>
        <div className="flex justify-between">
          {grades.map((grade, idx) => (
            <div key={grade} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] ${idx === 0 ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-400'}`}
              >
                ⚡
              </div>
              <span className="text-[10px] font-bold">{grade}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 프로상점 안내 */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <h3 className="font-bold text-lg mb-2">일반상점으로 이용중</h3>
        <p className="text-sm text-blue-500 mb-6 bg-blue-50 p-2 rounded">
          지금 프로상점에 가입하면,
        </p>
        <ul className="text-sm space-y-3 mb-6">
          <li className="flex items-center gap-2">✅ 카테고리별 판매 수수료 최대 40% 혜택</li>
          <li className="flex items-center gap-2">✅ 1만 광고포인트 지급(최초 가입 시)</li>
        </ul>
        <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-md mb-2">
          프로상점 가입하기
        </button>
        <button className="w-full py-3 border border-blue-600 text-blue-600 font-bold rounded-md">
          프로상점 이용가이드 보기
        </button>
      </div>
    </div>
  );
};
