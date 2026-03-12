import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const LOAD_MORE_DELAY_MS = 250;

interface UseInfiniteListOptions<T> {
  items: T[];
  pageSize?: number;
}

export const useInfiniteList = <T,>({ items, pageSize = 20 }: UseInfiniteListOptions<T>) => {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const loadTimerRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    return () => {
      if (loadTimerRef.current !== null) {
        window.clearTimeout(loadTimerRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const safeVisibleCount = Math.min(visibleCount, items.length);
  const hasNextPage = safeVisibleCount < items.length;

  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetchingMore) return;

    setIsFetchingMore(true);
    loadTimerRef.current = window.setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + pageSize, items.length));
      setIsFetchingMore(false);
    }, LOAD_MORE_DELAY_MS);
  }, [hasNextPage, isFetchingMore, items.length, pageSize]);

  const setSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node || !hasNextPage || isFetchingMore) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            loadMore();
          }
        },
        { rootMargin: '200px 0px' },
      );

      observerRef.current.observe(node);
    },
    [hasNextPage, isFetchingMore, loadMore],
  );

  const visibleItems = useMemo(() => items.slice(0, safeVisibleCount), [items, safeVisibleCount]);

  return {
    visibleItems,
    isFetchingMore,
    hasNextPage,
    setSentinelRef,
  };
};
