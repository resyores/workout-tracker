import React, { useEffect, useState, useRef, useCallback } from "react";
import SearchDiv from "../components/complex/SearchDiv";
import { useCookies } from "react-cookie";
import axios from "axios";
import Workout from "../components/RowComponents/WorkoutRow";
import useLoader from "../Hooks/useLoader";
import useObserver from "../Hooks/useObserver";
export default function Home() {
  const [cookies, _] = useCookies();
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
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
  if (workouts.length || query.length)
    return (
      <>
        <SearchDiv handleSearch={handleSearch} />
        {workouts.map((workout, index) => {
          if (workouts.length - 1 == index)
            return (
              <span ref={lastWorkoutElementRef}>
                <Workout
                  workout={workout}
                  onDelete={onDelete}
                  changeState={changeState}
                  mine={true}
                />
              </span>
            );
          return (
            <Workout
              workout={workout}
              onDelete={onDelete}
              changeState={changeState}
              mine={true}
            />
          );
        })}
        <div>{loading && "loading..."}</div>
        <div>{error && "error"}</div>
      </>
    );
  return <h2 className="text-muted text-center mt-4">You have no workouts</h2>;
}
