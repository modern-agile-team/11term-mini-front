const FilterBar = () => {
  return (
    <div className="max-w-[1024px] mx-auto px-4 pt-8 pb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] font-bold">아우터</h2>
          <span className="text-gray-400 text-[14px]">131,067개</span>
        </div>

        <div className="flex gap-4 text-[13px] text-gray-500">
          <button className="text-[#ff5058] font-bold">최신순</button>
          <button className="hover:text-black">인기순</button>
          <button className="hover:text-black">저가순</button>
          <button className="hover:text-black">고가순</button>
        </div>
      </div>
      <div className="border-b border-gray-100"></div>
    </div>
  );
};

export default FilterBar;
