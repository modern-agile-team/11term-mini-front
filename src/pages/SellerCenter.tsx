import React from 'react';

const SellerCenter = () => {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* 판매자 센터 상단 바 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
              <span className="text-2xl">📊</span> 판매자센터
            </h1>
            <nav className="flex gap-6 text-[15px] font-medium text-gray-600">
              <span className="text-black border-b-2 border-black pb-5 mt-5">홈</span>
              <span className="hover:text-black cursor-pointer">프로상점</span>
              <span className="hover:text-black cursor-pointer">광고</span>
              <span className="hover:text-black cursor-pointer">판매지원</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold">단풍02 👤</div>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto p-8">
        <h2 className="text-2xl font-bold mb-8">홈</h2>

        {/* 대시보드 그리드 레이아웃 */}
        <div className="grid grid-cols-12 gap-6">
          {/* 왼쪽 컬럼: 광고주 등급 & 일반상점 안내 */}
          <div className="col-span-4 flex flex-col gap-6">
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold">광고주 등급제 혜택</h3>
                <button className="text-xs border border-gray-300 px-2 py-1 rounded text-gray-500">
                  혜택보기
                </button>
              </div>
              <div className="flex justify-between">
                {['WHITE', 'BRONZE', 'SILVER', 'GOLD', 'DIAMOND'].map((grade, idx) => (
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

          {/* 중앙 컬럼: 광고 현황 & 포인트 */}
          <div className="col-span-4 flex flex-col gap-6">
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
                <button className="py-2 border border-gray-200 rounded text-sm">
                  포인트 충전하기
                </button>
                <button className="py-2 border border-gray-200 rounded text-sm">
                  이용/충전 내역
                </button>
              </div>
            </div>
          </div>

          {/* 오른쪽 컬럼: 배너 & 새로운 소식 */}
          <div className="col-span-4 flex flex-col gap-6">
            <div className="bg-blue-50 p-6 rounded-lg relative overflow-hidden min-h-[160px]">
              <h3 className="text-lg font-bold leading-tight">
                첫 광고 포인트 충전 시<br />
                10만 포인트 추가 증정
              </h3>
              <div className="absolute right-4 bottom-4 text-4xl opacity-20">🪙</div>
              <div className="absolute right-4 top-4 text-xs bg-black/10 px-2 py-1 rounded">
                1 / 3
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <h3 className="font-bold mb-4">새로운 소식</h3>
              <div className="space-y-6">
                {[
                  {
                    title: '[공지] 번개머니 서비스 출시 및 판매 수수료 변경 안내',
                    date: '2025.08.18',
                  },
                  {
                    title: '[공지] 번개장터를 매입자로 하는 세금계산서 발행 불가 안내',
                    date: '2025.08.08',
                  },
                  { title: '[공지] 광고주 등급 기준과 혜택이 변경됩니다.', date: '2024.07.23' },
                ].map((news, i) => (
                  <div key={i} className="group cursor-pointer">
                    <p className="text-[13px] font-medium group-hover:underline mb-1">
                      {news.title}
                    </p>
                    <span className="text-[11px] text-gray-400">공지 {news.date}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-2 border border-gray-200 rounded text-sm text-gray-500">
                모두보기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerCenter;
