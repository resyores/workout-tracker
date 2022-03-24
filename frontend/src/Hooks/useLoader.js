import { useState, useEffect } from "react";
import axios from "axios";
export default function useLoader(
  query,
  pageNumber,
  token,
  targetUrl,
  reverse
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  useEffect(Start, []);
  if (!reverse) reverse = false;
  function Start() {
    axios.defaults.headers.common["authorization"] = "bearer " + token;
  }
  useEffect(() => setItems([]), [query]);
  useEffect(() => {
    let cancel;
    axios
      .get(targetUrl, {
        params: { q: query, page: pageNumber },
        cancelToken: axios.CancelToken((c) => (cancel = c)),
      })
      .then((res) => {
        setItems((prevItems) => {
          if (reverse) return [...new Set([...prevItems, ...res.data])];
          return [...new Set([...prevItems, ...res.data])];
        });
        setHasMore(res.data.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber]);
  return { loading, error, hasMore, items, setItems };
}
