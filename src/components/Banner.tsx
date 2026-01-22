const Banner = () => {
  return (
    <section className="w-full bg-[#F2F2F2] overflow-hidden">
      <div className="max-w-[1024px] mx-auto h-[300px] flex items-center justify-between px-4 relative">
        {/* 왼쪽: 텍스트 영역 */}
        <div className="z-10 animate-fade-in">
          <h2 className="text-[32px] font-bold leading-tight mb-4">
            나 혼자만 알고 싶은
            <br />
            <span className="text-[#ff5058]">6만원 쿠폰팩</span>
          </h2>
          <p className="text-gray-600 text-lg">
            지금 번개장터 앱 다운로드 받고
            <br />
            다양한 혜택을 누려보세요!
          </p>

          <button className="mt-6 px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            자세히 보기
          </button>
        </div>

        {/* 오른쪽: 이미지 영역 */}
        <div className="h-full py-4">
          <img
            src="https://via.placeholder.com/450x260"
            alt="메인 배너 이미지"
            className="h-full object-contain transform hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* 슬라이드 화살표 (장식용 아이콘) */}
        <button className="absolute left-[-40px] top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 hidden lg:block text-4xl font-light">
          ‹
        </button>
        <button className="absolute right-[-40px] top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 hidden lg:block text-4xl font-light">
          ›
        </button>
      </div>
    </section>
  );
};

export default Banner;
