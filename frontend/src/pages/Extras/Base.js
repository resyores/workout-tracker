import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Base() {
  const Navigate = useNavigate();
  const [cookies, _] = useCookies(["user", "token"]);
  useEffect(() => CheckIfToken(), []);
  function CheckIfToken() {
    const token = cookies.token;
    if (token) Navigate("/Home", { replace: true });
    else Navigate("/Login", { replace: true });
  }

  return <></>;
}
