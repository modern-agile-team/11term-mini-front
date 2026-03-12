import React from 'react';

interface AuthFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export const AuthField = React.memo(({ label, error, children }: AuthFieldProps) => (
  <div className="border-b border-gray-200 pb-2">
    <label className="text-[11px] font-bold text-gray-400">{label}</label>
    {children}
    {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
  </div>
));
