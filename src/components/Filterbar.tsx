type SortKey = 'latest' | 'popular' | 'low' | 'high';

type Props = {
  title: string;
  countText: string;
  sort: SortKey;
  onChangeSort: (next: SortKey) => void;
};

const Filterbar = ({ title, countText, sort, onChangeSort }: Props) => {
  const active = 'text-[#ff5058] font-bold';
  const normal = 'hover:text-black';

  return (
    <div className="max-w-[1024px] mx-auto px-4 pt-8 pb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] font-bold">{title}</h2>
          <span className="text-gray-400 text-[14px]">{countText}</span>
        </div>

        <div className="flex gap-4 text-[13px] text-gray-500">
          <button
            className={sort === 'latest' ? active : normal}
            onClick={() => onChangeSort('latest')}
          >
            최신순
          </button>
          <button
            className={sort === 'popular' ? active : normal}
            onClick={() => onChangeSort('popular')}
          >
            인기순
          </button>
          <button className={sort === 'low' ? active : normal} onClick={() => onChangeSort('low')}>
            저가순
          </button>
          <button
            className={sort === 'high' ? active : normal}
            onClick={() => onChangeSort('high')}
          >
            고가순
          </button>
        </div>
      </div>

      <div className="border-b border-gray-100"></div>
    </div>
  );
};

export default Filterbar;
