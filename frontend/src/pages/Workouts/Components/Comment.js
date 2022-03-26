import React from "react";
import FormatDate from "../../../utils/FormatDate";
export default function Comment({ comment }) {
  return (
    <div
      className="list-group-item rounded  bg-light d-flex py-0"
      style={{ position: "relative" }}
    >
      <span>
        <a
          className="border text-dark text-decoration-none"
          href={"/friends/" + comment.UserId}
        >
          {comment.UserName}
        </a>
      </span>
      <div>
        <small className="ms-2">{FormatDate(comment.PostDate)}</small>
        <h5>{comment.Content}</h5>
      </div>
    </div>
  );
}
