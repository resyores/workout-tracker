import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import commentLogo from "../../../logos/comment.png";
import WorkoutHead from "../Components/WorkoutHead";
import axios from "axios";
import Comments from "../Components/WorkoutComments";
import io from "socket.io-client";
import SetsView from "../Components/SetsView";
import useLoader from "../../../Hooks/useLoader";
import useObserver from "../../../Hooks/useObserver";
import InputVideo from "../Components/InputVideo";
export default function Workout() {
  const id = parseInt(window.location.href.split("/")[4]);
  const Navigate = useNavigate();
  const [cookies, _] = useCookies();
  const [workout, setWorkout] = useState([]);
  const [title, setTitle] = useState("");
  const [userName, setUserName] = useState("");
  const [isPublic, setPublic] = useState(false);
  const [date, setDate] = useState(new Date(0));
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currSetNum, setCurrSetNum] = useState(-1);
  let socket;
  let targetUrl = cookies.user
    ? "http://10.0.0.19:4000/comment/" + id
    : "http://10.0.0.19:4000/exercises";
  const {
    loading,
    error,
    hasMore,
    items: comments,
    setItems: setComments,
  } = useLoader(null, pageNumber, cookies.token, targetUrl);
  const lastCommentElementRef = useObserver(loading, hasMore, setPageNumber);
  const onClickCommentsButton = () => {
    setIsCommentOpen(!isCommentOpen);
  };
  const userNameText = () => {
    if (userName == cookies.user.username) return null;
    return <small className="ms-4 mt-3"> by {userName}</small>;
  };
  useEffect(() => {
    axios.defaults.headers.common["authorization"] = "bearer " + cookies.token;
  }, []);
  useEffect(() => {
    if (currSetNum != -1) setIsVideoOpen(true);
  }, [currSetNum]);
  useEffect(() => {
    if (!isVideoOpen) setCurrSetNum(-1);
  }, [isVideoOpen]);
  function upload(File) {
    if (!File) return;
    const formData = new FormData();
    formData.append("video", File);
    axios
      .post(`http://10.0.0.19:4000/SetVideo/${id}/${currSetNum}`, formData)
      .then((res) => {
        setCurrSetNum(-1);
        setIsVideoOpen(false);
        window.location.reload(false);
      })
      .catch((err) => {
        setCurrSetNum(-1);
        setIsVideoOpen(false);
      });
  }
  useEffect(Start, []);
  function Start() {
    socket = io.connect("http://10.0.0.19:4001");
    socket.emit("enter-room", id, cookies.token);
    axios.defaults.headers.common["authorization"] = "bearer " + cookies.token;
    axios
      .get("http://10.0.0.19:4000/workouts/" + id)
      .then((res) => {
        let index = -1;
        setWorkout([
          ...res.data.exersets.map((exerSet) => {
            let newExerSet = exerSet;
            newExerSet.sets = newExerSet.sets.map((set) => {
              index++;
              return { ...set, index: index };
            });
            return {
              ...newExerSet,
              size: Math.min(3, exerSet.sets.length) * 50,
            };
          }),
        ]);
        setTitle(res.data.title);
        setPublic(res.data.public);
        setUserName(res.data.username);
        setDate(new Date(res.data.date));
        if (!socket) return;
        socket.on("chat-message", ({ user, message }) => {
          if (user.UserID != cookies.user.UserID) {
            setComments((prevComments) => [
              {
                Content: message,
                UserName: user.UserName,
                UserId: user.UserID,
                PostDate: new Date(),
              },
              ...prevComments,
            ]);
          }
        });
      })
      .catch((err) => {
        Navigate("/Home", {
          replace: true,
        });
      });
  }
  useEffect(() => {
    return () => {
      if (socket) socket.close();
    };
  }, []);

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
      <InputVideo
        isOpen={isVideoOpen}
        setIsOpen={setIsVideoOpen}
        upload={upload}
      />
      <div className="d-flex">
        <SetsView
          isCommentOpen={isCommentOpen}
          workout={workout}
          setCurrSetNum={setCurrSetNum}
          WorkoutId={id}
          token={cookies.token}
          isCreator={userName == cookies.user.username}
        />
        {isCommentOpen && (
          <span className="w-50">
            <Comments
              comments={comments}
              setComments={setComments}
              id={id}
              cookies={cookies}
              lastCommentElementRef={lastCommentElementRef}
            />
          </span>
        )}
      </div>
    </>
  );
}
