import { LeftColumn } from '../SellerCenter/LeftColumn';
import { MiddleColumn } from '../SellerCenter/MiddleColumn';
import { RightColumn } from '../SellerCenter/RightColumn';
import { useAuth } from '../hooks/useAuth';

const SellerCenter = () => {
  const { userInfo } = useAuth();

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* 헤더 섹션 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-300 mx-auto px-6 h-16 flex items-center justify-between">
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
            {/* 닉넴출력 / 없을시 판매자로 출력 */}
            <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold">
              {userInfo?.nickname || '판매자'} 👤
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-300 mx-auto p-8">
        <h2 className="text-2xl font-bold mb-8">홈</h2>

        {/* 대시보드 그리드 */}
        <div className="grid grid-cols-12 gap-6">
          <LeftColumn />
          <MiddleColumn />
          <RightColumn />
        </div>
      </main>
    </div>
  );
};

export default SellerCenter;
