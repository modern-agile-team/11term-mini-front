import React from 'react';
import { ImageUploader } from './ImageUploader';
import type { SectionProps } from '../../types/Sellerform';

const INPUT_STYLE =
  'w-full border border-gray-200 p-2.5 text-sm outline-none hover:border-gray-400 focus:border-black transition-all rounded-sm';

export const SellerFormSection = ({
  label,
  type = 'custom',
  name,
  value,
  onChange,
  placeholder,
  maxLength,
  count,
  description,
  required,
  isLast,
  unit,
  children,
  images,
  onImageUpload,
  onRemoveImage,
}: SectionProps) => {
  const renderContent = () => {
    switch (type) {
      case 'text':
        return (
          <div className="relative">
            <input
              name={name}
              value={value ?? ''}
              onChange={onChange}
              placeholder={placeholder}
              className={INPUT_STYLE}
              maxLength={maxLength}
            />
            {maxLength && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                {String(value || '').length}/{maxLength}
              </span>
            )}
          </div>
        );
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder}
            className={`${INPUT_STYLE} h-32 resize-none leading-relaxed text-[13px]`}
            maxLength={maxLength}
          />
        );
      case 'number':
        return (
          <div className="relative w-72">
            <input
              type="number"
              name={name}
              value={value ?? ''}
              onChange={onChange}
              placeholder={placeholder}
              className={INPUT_STYLE}
            />
            {unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                {unit}
              </span>
            )}
          </div>
        );
      case 'image':
        return (
          <ImageUploader
            images={images || []}
            onUpload={onImageUpload!}
            onRemove={onRemoveImage!}
          />
        );
      default:
        return children;
    }
  };

  return (
    <section className={`flex ${isLast ? '' : 'border-b'} pb-8 mb-8`}>
      <div className="w-1/5 pt-1">
        <label className="text-[15px] font-bold text-gray-800 flex items-center">
          {label}
          {required && <span className="text-[#ff5058] ml-1">*</span>}
          {count && <span className="text-gray-400 font-normal text-[11px] ml-1">({count})</span>}
        </label>
      </div>
      <div className="w-4/5">
        {renderContent()}
        {description && (
          <p className="text-blue-500 text-[11px] mt-3 font-medium italic">{description}</p>
        )}
      </div>
    </section>
  );
};
