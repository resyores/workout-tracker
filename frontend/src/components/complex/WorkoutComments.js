import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import Comment from "../RowComponents/Comment";
import Button from "react-bootstrap/Button";
export default function Comments({ comments, setComments, cookies, id }) {
  const [commentWrite, setCommentWrite] = useState("");
  function postComment() {
    if (commentWrite) {
      axios
        .post("http://10.0.0.19:4000/comment/" + id, { content: commentWrite })
        .then((res) => {
          setComments([
            {
              Content: commentWrite,
              UserName: cookies.user.username,
              UserId: cookies.user.UserID,
            },
            ...comments,
          ]);
          setCommentWrite("");
        });
    }
  }
  return (
    <div id="comments w-100">
      <>
        <div className="d-flex">
          <input
            className="w-100 rounded bg-light border border-secondary"
            onChange={(e) => setCommentWrite(e.target.value)}
            value={commentWrite}
          />
          <Button className="btn-sm btn-secondary" onClick={postComment}>
            comment
          </Button>
        </div>
        {comments.map((comment) => {
          return <Comment comment={comment} />;
        })}
      </>
    </div>
  );
}
