import { SELLER_NAV_MENU } from '../../constants/seller';

export const SellerSubNav = () => {
  return (
    <nav className="border-b sticky top-0 bg-white z-40">
      <div className="max-w-[850px] mx-auto flex gap-8 py-3 font-semibold px-4 text-[13px]">
        {SELLER_NAV_MENU.map((menu) => (
          <span
            key={menu.id}
            className={`${
              menu.active ? 'text-[#ff5058] border-b-2 border-[#ff5058]' : 'text-gray-400'
            } pb-3 -mb-3 cursor-pointer transition-colors`}
          >
            {menu.label}
          </span>
        ))}
      </div>
    </nav>
  );
};
