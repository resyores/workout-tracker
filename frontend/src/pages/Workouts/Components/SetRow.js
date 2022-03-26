import React, { useState } from "react";
import Modal from "../../../BaseComponents/Modal";
import Button from "react-bootstrap/Button";
export default function Set({
  exerciseName,
  reps,
  weight,
  index,
  video,
  openModal,isCreator
}) {
  let colors = ["info", "light"];
  let color = "bg-" + colors[index % colors.length];
  const [videoOpen, setVideoOpen] = useState(false);
  const toggleVideo = () => {
    setVideoOpen(!videoOpen);
  };
  return (
    <div className="d-flex">
      <div className="list-group-item rounded  bg-secondary d-flex justify-content-around mt-0 w-100">
        <h5
          className={color + " w-50 rounded me-3 d-flex justify-content-center"}
        >
          {exerciseName}
        </h5>
        <h5 className="me-2 border border-dark">{weight} kg</h5>
        <p>X {reps} Reps</p>
        <div className="d-flex">
          {isCreator&&<p onClick={openModal} className="bi-camera-reels-fill" />}
          {video && <p onClick={toggleVideo} className="bi-file-play ms-2" />}
        </div>
      </div>
      <Modal open={videoOpen}>
        <div className="d-flex">
          <Button
            onClick={toggleVideo}
            className="rounded btn-sm mb-auto me-auto btn-light btn-outline-danger"
          >
            X
          </Button>
          {video}
        </div>
      </Modal>
    </div>
  );
}
