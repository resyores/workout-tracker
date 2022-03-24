import React from "react";
export default function MessageRow({ message, userid }) {
  const classes =
    message.senderid == userid
      ? "list-group-item w-75 mt-1 rounded list-group-item-success"
      : "list-group-item w-75 mt-1 rounded list-group-item-light ms-auto me-0";
  return <div className={classes}>{message.content}</div>;
}
