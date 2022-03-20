import React from "react";

export default function Set({ exerciseName, reps, weight, index }) {
  let colors = ["info", "light"];
  let color = "bg-" + colors[index % colors.length];
  return (
    <div className="list-group-item rounded  bg-secondary d-flex justify-content-around">
      <h5
        className={color + " w-50 rounded me-3 d-flex justify-content-center"}
      >
        {exerciseName}
      </h5>
      <h5 className="me-2 border border-dark">{weight} kg</h5>
      <p>X {reps} Reps</p>
    </div>
  );
}
