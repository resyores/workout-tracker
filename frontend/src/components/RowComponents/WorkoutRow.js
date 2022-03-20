import React from "react";
import Button from "react-bootstrap/Button";
export default function Workout({ workout, onDelete, changeState, mine }) {
  function publicToString(isPublic) {
    if (isPublic) return <p class="text-info">public</p>;
    return <p class="text-muted">private</p>;
  }
  function publicToChangeString(isPublic) {
    if (isPublic) return "UnShare";
    return "Share";
  }
  function publicToChangeStringColor(isPublic) {
    if (isPublic) return "warning";
    return "primary";
  }
  function deleteThis() {
    onDelete(workout.WorkoutId);
  }
  function changeThis() {
    changeState(workout.WorkoutId);
  }
  function dateString() {
    let date = new Date(workout.WorkoutDate);
    let now = new Date();
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = now.getTime() - date.getTime();
    const diffInDays = Math.round(diffInTime / oneDay);
    let str;
    if (diffInDays == 0) str = "today ";
    else if (diffInDays == 1) str = "yesterday ";
    else str = diffInDays + " days ago ";
    return (
      str +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }
  function Buttons() {
    if (mine)
      return (
        <>
          <Button
            size="lg"
            onClick={changeThis}
            className={
              "rounded btn-sm btn h-25 mt-4  btn-" +
              publicToChangeStringColor(workout.public)
            }
          >
            {publicToChangeString(workout.public)}
          </Button>
          <Button
            size="lg"
            onClick={deleteThis}
            className="rounded-circle btn-sm btn h-25  mt-4 btn-light btn-outline-danger"
          >
            X
          </Button>
        </>
      );
  }
  return (
    <div className="d-flex">
      <a
        href={"/workouts/" + workout.WorkoutId}
        className="list-group-item list-group-item-action rounded-pill mt-2 "
        aria-current="false"
      >
        <div className="d-flex justify-content-around ">
          <div>
            <h5 className="mb-2">{workout.Title}</h5>
            <small>{publicToString(workout.public)}</small>
          </div>
          <small>{dateString()}</small>
        </div>
      </a>
      {Buttons()}
    </div>
  );
}
