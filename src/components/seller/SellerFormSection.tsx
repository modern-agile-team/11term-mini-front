import React from 'react';

interface SectionProps {
  label: string;
  children: React.ReactNode;
  count?: string;
  isLast?: boolean;
}

export const SellerFormSection = ({ label, children, count, isLast }: SectionProps) => (
  <section className={`flex ${isLast ? '' : 'border-b'} pb-8 mb-8`}>
    <label className="w-1/5 text-[15px] font-bold pt-1">
      {label} {count && <span className="text-gray-400 font-normal text-xs ml-1">({count})</span>}
    </label>
    <div className="w-4/5">{children}</div>
  </section>
);
