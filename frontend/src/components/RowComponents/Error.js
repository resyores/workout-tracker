import React from "react";
export default function Error({ error, index }) {
  if (!error.message.length || (index != null) & (error.index != index))
    return null;
  return <p className="text-danger">{error.message}</p>;
}
