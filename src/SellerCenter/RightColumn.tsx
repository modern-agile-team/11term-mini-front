export const RightColumn = () => {
  const newsList = [
    { title: '[공지] 번개머니 서비스 출시 및 판매 수수료 변경 안내', date: '2025.08.18' },
    { title: '[공지] 번개장터를 매입자로 하는 세금계산서 발행 불가 안내', date: '2025.08.08' },
    { title: '[공지] 광고주 등급 기준과 혜택이 변경됩니다.', date: '2024.07.23' },
  ];

  return (
    <div className="col-span-4 flex flex-col gap-6">
      <div className="bg-blue-50 p-6 rounded-lg relative overflow-hidden min-h-[160px]">
        <h3 className="text-lg font-bold leading-tight">
          첫 광고 포인트 충전 시<br />
          10만 포인트 추가 증정
        </h3>
        <div className="absolute right-4 bottom-4 text-4xl opacity-20">🪙</div>
      </div>

      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <h3 className="font-bold mb-4">새로운 소식</h3>
        <div className="space-y-6">
          {newsList.map((news, i) => (
            <div key={i} className="group cursor-pointer">
              <p className="text-[13px] font-medium group-hover:underline mb-1">{news.title}</p>
              <span className="text-[11px] text-gray-400">공지 {news.date}</span>
            </div>
          ))}
        </div>
        <button className="w-full mt-8 py-2 border border-gray-200 rounded text-sm text-gray-500">
          모두보기
        </button>
      </div>
    </div>
  );
};
