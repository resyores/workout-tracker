import { useRef, useCallback } from "react";

export default function useObserver(loading, hasMore, setPageNumber) {
  let updated = false;
  const observer = useRef();
  const lastItemElementRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !updated) {
          setPageNumber((prevPage) => prevPage + 1);
          updated = true;
        }
      });
      if (node) {
        observer.current.observe(node);
        updated = false;
      }
    },
    [loading, hasMore]
  );
  return lastItemElementRef;
}
