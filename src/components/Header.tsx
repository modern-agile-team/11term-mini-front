import { Link } from 'react-router-dom'; // 👈 추가
import CategoryMenu from './CategoryMenu';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* 1. 최상단 좁은 메뉴 */}
      <div className="border-b border-gray-100">
        <div className="flex justify-end max-w-[1024px] mx-auto py-2 px-4 text-xs text-gray-500 gap-4">
          <button className="hover:text-black">로그인/회원가입</button>
          <button className="hover:text-black">내단체</button>
        </div>
      </div>

      {/* 2. 메인 헤더 영역 */}
      <div className="max-w-[1024px] mx-auto flex items-center justify-between py-6 px-4 gap-8">
        {/* 📍 로고 (Link 추가) */}
        <Link to="/">
          <h1 className="text-3xl font-bold text-[#ff5058] cursor-pointer flex-shrink-0">
            번개장터
          </h1>
        </Link>

        {/* 검색창 영역 */}
        <div className="flex-1 max-w-[460px] relative">
          <input 
            type="text" 
            placeholder="상품명, 지역명, @상점명 입력"
            className="w-full border-2 border-[#ff5058] px-4 py-2 outline-none text-sm"
          />
          <span className="absolute right-4 top-2.5 text-[#ff5058] cursor-pointer">🔍</span>
        </div>

        {/* 오른쪽 아이콘 메뉴 */}
        <div className="flex items-center gap-6 text-[14px] font-medium flex-shrink-0">
          <div className="flex flex-col items-center cursor-pointer hover:text-[#ff5058]">
            <span className="text-xl">📦</span>
            <span className="text-[12px] mt-1">내폰</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-[#ff5058]">
            <span className="text-xl">💰</span>
            <span className="text-[12px] mt-1">판매하기</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-[#ff5058]">
            <span className="text-xl">💬</span>
            <span className="text-[12px] mt-1">번개톡</span>
          </div>
        </div>
      </div>

      {/* 3. 하단 카테고리 라인 */}
      <div className="border-t border-gray-100">
        <div className="max-w-[1024px] mx-auto px-4 flex items-center gap-6">
          <CategoryMenu />
          <div className="h-4 w-[1px] bg-gray-200"></div>
          <button className="text-[14px] font-semibold hover:text-[#ff5058] py-4 cursor-pointer">
            번개장터 판매자센터
          </button>
        </div>
      </div>
    </header>
  );
};

<Link to="/">
  <h1 className="text-3xl font-bold text-[#ff5058] cursor-pointer">
    번개장터
  </h1>
</Link>

export default Header;