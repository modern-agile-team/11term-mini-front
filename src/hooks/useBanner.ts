import { useState, useEffect, useCallback } from 'react';
import { BANNER_CONFIG } from '../constants/banner';

export const useBanner = (itemCount: number) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIdx((prev) => (prev === itemCount - 1 ? 0 : prev + 1));
  }, [itemCount]);

  const goToPrev = useCallback(() => {
    setCurrentIdx((prev) => (prev === 0 ? itemCount - 1 : prev - 1));
  }, [itemCount]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIdx(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(goToNext, BANNER_CONFIG.INTERVAL_MS);
    return () => clearInterval(timer);
  }, [goToNext]);

  return { currentIdx, goToNext, goToPrev, goToIndex };
};
