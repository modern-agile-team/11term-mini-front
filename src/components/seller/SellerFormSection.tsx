interface SectionProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  count?: string;
}

export const SellerFormSection = ({ label, children, count }: SectionProps) => (
  <div className="flex border-b pb-10 mb-10">
    <label className="w-1/4 text-lg font-medium">
      {label} {count && <span className="text-gray-400 text-sm">{count}</span>}
    </label>
    <div className="w-3/4">{children}</div>
  </div>
);
