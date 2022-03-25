import React from "react";
import FormatDate from "../../../utils/FormatDate";
export default function WorkoutHead({ props }) {
  return (
    <div class="d-flex justify-content-around w-100 bg-light border border-dark">
      <span>
        <span className="d-flex">
          <h1>{props.title + "  "}</h1>
          {props.userNameText()}
        </span>
        <p className="text-primary">at {FormatDate(props.date)}</p>
      </span>
      <div>
        {props.publicToString()}
        <img
          className="mt-4 me-0"
          src={props.commentLogo}
          width={30}
          height={30}
          onClick={props.onClickCommentsButton}
        />
      </div>
    </div>
  );
}
