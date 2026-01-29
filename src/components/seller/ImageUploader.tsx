import React from 'react';

interface ImageUploaderProps {
  images: string[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  maxCount?: number;
}

export const ImageUploader = ({
  images,
  onUpload,
  onRemove,
  maxCount = 12,
}: ImageUploaderProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      {/* 이미지 등록 버튼 */}
      <label className="w-32 h-32 bg-gray-50 border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors group">
        <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📷</span>
        <span className="text-gray-400 text-xs">이미지 등록</span>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={onUpload}
          disabled={images.length >= maxCount}
        />
      </label>

      {/* 미리보기 목록 */}
      {images.map((src, i) => (
        <div key={i} className="relative w-32 h-32 border border-gray-100 bg-black group">
          <img
            src={src}
            alt={`preview-${i}`}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          />

          {/* 삭제 버튼 */}
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 rounded-full text-xs flex items-center justify-center border border-white z-10 hover:bg-[#ff5058] transition-colors"
          >
            ×
          </button>

          {/* 대표 이미지 표시 */}
          {i === 0 && (
            <div className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] text-center py-0.5">
              대표이미지
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
