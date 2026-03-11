const ProductCardSkeleton = () => {
  return (
    <div className="w-full border border-gray-200 bg-white animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-4/5" />
        <div className="h-5 bg-gray-200 rounded w-2/3 mt-3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
