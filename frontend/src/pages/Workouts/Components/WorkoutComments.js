import React, { useState } from "react";
import axios from "axios";
import Comment from "./Comment";
import Button from "react-bootstrap/Button";
const styles = {
  position: "relative",
  height: "300px",
  overflow: "auto",
  backgroundColor: "#F5F5F5",
  borderRadius: "10px",
};
export default function Comments({
  comments,
  setComments,
  cookies,
  id,
  lastCommentElementRef,
}) {
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
              PostDate: new Date(),
            },
            ...comments,
          ]);
          setCommentWrite("");
        });
    }
  }
  return (
    <div id="comments w-50">
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
        <div className="d-flex flex-column" style={styles}>
          {comments.map((comment, index) => {
            if (index == comments.length - 1)
              return (
                <span ref={lastCommentElementRef}>
                  <Comment comment={comment} />
                </span>
              );
            return <Comment comment={comment} />;
          })}
        </div>
      </>
    </div>
  );
}
