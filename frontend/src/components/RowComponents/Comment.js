import React from "react";
export default function Comment({ comment }) {
  return (
    <div className="list-group-item rounded  bg-light d-flex py-0">
      <span>
        <a
          className="border text-dark text-decoration-none"
          href={"/friends/" + comment.UserId}
        >
          {comment.UserName}
        </a>
      </span>
      <h5 className="mt-3">{comment.Content}</h5>
    </div>
  );
}
