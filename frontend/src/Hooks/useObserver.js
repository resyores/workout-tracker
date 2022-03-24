import { useRef, useCallback } from "react";

export default function useObserver(loading, hasMore, setPageNumber) {
  const observer = useRef();
  const lastItemElementRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPage) => prevPage + 1);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore]
  );
  return lastItemElementRef;
}
