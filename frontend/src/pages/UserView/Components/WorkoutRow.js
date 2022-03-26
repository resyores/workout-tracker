import React from "react";
import Button from "react-bootstrap/Button";
import FormatDate from "../../../utils/FormatDate";
export default function Workout({ workout, mine, functions }) {
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
    functions.onDelete(workout.WorkoutId);
  }
  function changeThis() {
    functions.changeState(workout.WorkoutId);
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
          <div className="d-flex">
            <small className="mt-1 me-1">
              {FormatDate(workout.WorkoutDate)}
            </small>
            {mine && workout.unseen > 0 && (
              <div>
                <small className="rounded-circle bg-primary text-white px-1">
                  {workout.unseen}
                </small>
              </div>
            )}
          </div>
        </div>
      </a>
      {Buttons()}
    </div>
  );
}
