import React, { useEffect, useState } from "react";
import Set from "../../components/RowComponents/SetRow";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import commentLogo from "../../logos/comment.png";
import WorkoutHead from "../../components/complex/WorkoutHead";
import axios from "axios";
import Comments from "../../components/complex/WorkoutComments";
import Collapse from "react-bootstrap/Collapse";
import io from "socket.io-client";
export default function Workout() {
  const id = parseInt(window.location.href.split("/")[4]);
  const Navigate = useNavigate();
  const [cookies, _] = useCookies();
  const [workout, setWorkout] = useState([]);
  const [title, setTitle] = useState("");
  const [userName, setUserName] = useState("");
  const [isPublic, setPublic] = useState(false);
  const [date, setDate] = useState(new Date(0));
  const [comments, setComments] = useState([]);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  let socket;

  const onClickCommentsButton = () => {
    setIsCommentOpen(!isCommentOpen);
  };
  const userNameText = () => {
    if (userName == cookies.user.username) return null;
    return <small className="ms-4 mt-3"> by {userName}</small>;
  };
  useEffect(Start, []);
  function Start() {
    socket = io.connect("http://10.0.0.19:4001");
    socket.emit("new-user", id, cookies.token);
    const token = cookies.token;
    if (!token || !cookies.user) Navigate("/Login", { replace: true });
    axios.defaults.headers.common["authorization"] = "bearer " + token;
    axios
      .get("http://10.0.0.19:4000/workouts/" + id)
      .then((res) => {
        setWorkout([...res.data.exersets]);
        setTitle(res.data.title);
        setPublic(res.data.public);
        setUserName(res.data.username);
        setDate(new Date(res.data.date));
        setComments(res.data.comments);
      })
      .catch((err) => {
        Navigate("/Home", { replace: true });
      });
  }

  useEffect(() => {
    if (!socket) return;
    socket.on("chat-message", ({ user, message }) => {
      console.log(user);
      if (user.UserId == cookies.user.UserID) return;
      setComments((prevComments) => [
        {
          Content: message,
          UserName: user.UserName,
          UserId: user.UserID,
        },
        ...prevComments,
      ]);
    });
  });
  function publicToString() {
    if (isPublic) return <h3 class="text-info">public</h3>;
    return <h4 class="text-muted me-1">private</h4>;
  }
  return (
    <>
      <WorkoutHead
        props={{
          title,
          userNameText,
          date,
          publicToString,
          commentLogo,
          onClickCommentsButton,
        }}
      />
      <div className="d-flex">
        <div id="workouts" className="w-100">
          {workout.map((exerSet, index) => {
            return (
              <div className="d-flex align-items-center justify-content-center">
                <img
                  src={
                    "http://10.0.0.19:4000/exercises/" +
                    exerSet.exercise.exerciseid
                  }
                  height={80}
                  width={80}
                  className="rounded me-3 mb-4"
                />
                <div className="w-100">
                  {exerSet.sets.map((set) => {
                    return (
                      <Set
                        exerciseName={exerSet.exercise.exercisename}
                        reps={set.reps}
                        weight={set.weight}
                        index={index}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <Collapse in={isCommentOpen} dimension="width">
          <span>
            <Comments
              comments={comments}
              setComments={setComments}
              id={id}
              cookies={cookies}
            />
          </span>
        </Collapse>
      </div>
    </>
  );
}
