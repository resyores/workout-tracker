import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import useLoader from "../../../Hooks/useLoader";
import useObserver from "../../../Hooks/useObserver";
import WorkoutsView from "../Components/WorkoutsView";
import io from "socket.io-client";
import Toast from "react-bootstrap/Toast";
export default function Home({ workoutUpdated, setWorkoutUpdated }) {
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
  useEffect(() => {
    if (workoutUpdated != null) {
      UpdateWorkout(workoutUpdated);
      setWorkoutUpdated(null);
    }
  }, [workoutUpdated]);
  function UpdateWorkout(workout) {
    setWorkouts((prevWorkouts) => {
      return [
        workout,
        ...prevWorkouts.filter(
          (currworkout) => currworkout.WorkoutId != workout.WorkoutId
        ),
      ];
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
