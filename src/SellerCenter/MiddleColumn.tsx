export const MiddleColumn = () => {
  return (
    <div className="col-span-4 flex flex-col gap-6">
      {/* 광고 현황 */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm min-h-[300px] flex flex-col">
        <h3 className="font-bold mb-4">광고 현황</h3>
        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 text-sm">
          <p>현재 진행중인 광고가 없어요</p>
          <p>광고로 더 많은 매출을 올려보세요</p>
          <button className="mt-4 px-6 py-2 border border-blue-600 text-blue-600 rounded-md">
            광고 시작하기
          </button>
        </div>
      </div>

      {/* 광고 포인트 */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">광고 포인트</h3>
          <span className="text-[10px] text-gray-400">이번 달 기준 현재까지 🔄</span>
        </div>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span>유료 포인트 잔액</span>
            <span className="font-bold">-</span>
          </div>
          <div className="flex justify-between">
            <span>무료 포인트 잔액</span>
            <span className="font-bold">-</span>
          </div>
          <hr />
          <div className="flex justify-between text-gray-500">
            <span>총 광고비 잔액</span>
            <span className="font-bold">-</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-6">
          <button className="py-2 border border-gray-200 rounded text-sm">포인트 충전하기</button>
          <button className="py-2 border border-gray-200 rounded text-sm">이용/충전 내역</button>
        </div>
      </div>
    </div>
  );
};
