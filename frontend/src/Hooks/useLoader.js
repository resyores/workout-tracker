import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function useLoader(query, pageNumber, token, targetUrl) {
  const Navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  useEffect(Start, []);
  function Start() {
    if (!token) Navigate("/Login", { replace: true });
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
