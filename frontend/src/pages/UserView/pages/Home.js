import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import useLoader from "../../../Hooks/useLoader";
import useObserver from "../../../Hooks/useObserver";
import WorkoutsView from "../Components/WorkoutsView";
import io from "socket.io-client";
import Toast from "react-bootstrap/Toast";
export default function Home() {
  const [cookies, _] = useCookies(["user", "token"]);
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [show, setShow] = useState(false);
  const [toastData, setToastData] = useState({});
  let targetUrl = cookies.user
    ? "http://10.0.0.19:4000/user/" + cookies.user.UserID + "/workouts"
    : "http://10.0.0.19:4000/exercises";
  const {
    loading,
    error,
    hasMore,
    items: workouts,
    setItems: setWorkouts,
  } = useLoader(query, pageNumber, cookies.token, targetUrl);
  const lastWorkoutElementRef = useObserver(loading, hasMore, setPageNumber);
  useEffect(Start, []);
  let socket;
  function AlertWorkout(workout, sender, content) {
    setToastData({
      from: sender.UserName + " commented at " + workout.Title,
      content,
      link: "/workouts/" + workout.WorkoutId,
    });
    setShow(true);
    console.log(workout);
    setWorkouts((prevWorkouts) => {
      return [
        workout,
        ...prevWorkouts.filter(
          (currworkout) => currworkout.WorkoutId != workout.WorkoutId
        ),
      ];
    });
  }
  function Start() {
    axios.defaults.headers.common["authorization"] = "bearer " + cookies.token;
    socket = io.connect("http://10.0.0.19:4001");
    socket.emit("new-user", cookies.token);
    socket.on("new-comment", (WorkoutId, sender, content) => {
      let workout = workouts.filter((w) => w.WorkoutId == WorkoutId)[0];
      if (workout) {
        workout.unseen++;
        AlertWorkout(workout, sender, content);
      } else {
        axios
          .get(`http://10.0.0.19:4000/workouts/${WorkoutId}/basic`)
          .then((res) => {
            workout = res.data;
            workout.WorkoutId = WorkoutId;
            AlertWorkout(workout, sender, content);
          });
      }
    });
    socket.on("new-message", (UserId, username, message) => {
      setToastData({
        from: username + ":",
        content: message,
        link: "/messages/" + UserId,
      });
      setShow(true);
    });
  }
  function handleSearch(event) {
    setQuery(event.target.value);
    setPageNumber(1);
  }
  function onDelete(WorkoutId) {
    axios.delete("http://10.0.0.19:4000/workouts/" + WorkoutId).then((res) => {
      setWorkouts(workouts.filter((workout) => workout.WorkoutId != WorkoutId));
    });
  }
  function changeState(WorkoutId) {
    let isPublic = workouts.filter(
      (workout) => workout.WorkoutId == WorkoutId
    )[0].public;
    axios
      .patch(
        "http://10.0.0.19:4000/workouts/" +
          WorkoutId +
          "/changeState/" +
          Number(!isPublic)
      )
      .then((res) => {
        let temp = [...workouts];
        temp.filter((workout) => workout.WorkoutId == WorkoutId)[0].public =
          !isPublic;
        setWorkouts(temp);
      });
  }
  return (
    <>
      <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
        <Toast.Header>
          <strong className="me-auto">{toastData.from}</strong>
          <small>just now</small>
        </Toast.Header>
        <a href={toastData.link} className="text-decoration-none">
          <Toast.Body>
            <p className="text-dark">{toastData.content}</p>
          </Toast.Body>
        </a>
      </Toast>
      <WorkoutsView
        workouts={workouts}
        query={query}
        message={"You have no workouts"}
        lastWorkoutElementRef={lastWorkoutElementRef}
        handleSearch={handleSearch}
        functions={{ onDelete, changeState }}
      />
    </>
  );
}
