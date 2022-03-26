import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EmptyPicture from "../logos/profile.jpg";
import ImageModal from "./ImageModal";
import axios from "axios";
import io from "socket.io-client";
import Toast from "react-bootstrap/Toast";
import Home from "../pages/UserView/pages/Home";
export default function Navbar({ cookies, logout, setWorkoutUpdated }) {
  const [isOpen, setIsOpen] = useState(false);
  const ProfileUrl = `http://10.0.0.19:4000/user/${cookies.user.UserID}/profile`;
  const [imageUrl, setImageUrl] = useState(ProfileUrl);
  const [show, setShow] = useState(false);
  const [toastData, setToastData] = useState({});
  useEffect(() => setImageUrl(ProfileUrl + "?" + Date.now()), [isOpen]);
  function upload(File) {
    const formData = new FormData();
    formData.append("ProfilePicture", File);
    axios
      .post("http://10.0.0.19:4000/user/addPicture", formData)
      .then(() => setIsOpen(false));
  }
  function AlertWorkout(workout, sender, content) {
    setToastData({
      from: sender.UserName + " commented at " + workout.Title,
      content,
      link: "/workouts/" + workout.WorkoutId,
    });
    setShow(true);
  }
  useEffect(Start, []);
  let socket;
  function Start() {
    axios.defaults.headers.common["authorization"] = "bearer " + cookies.token;
    socket = io.connect("http://10.0.0.19:4001");
    socket.emit("new-user", cookies.token);
    socket.on("new-comment", (WorkoutId, sender, content) => {
      axios
        .get(`http://10.0.0.19:4000/workouts/${WorkoutId}/basic`)
        .then((res) => {
          let workout = res.data;
          workout.WorkoutId = WorkoutId;
          AlertWorkout(workout, sender, content);
          setWorkoutUpdated(workout);
        });
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
  return (
    <>
      <nav className="p-3 navbar navbar-dark bg-primary navbar-expand-lg justify-content-between">
        <ul className="navbar-nav mr-auto d-flex">
          <Link to="/Home" className="navbar-brand">
            Home
          </Link>
          <li className="navbar-item">
            <Link to="/workouts/create" className="nav-link">
              Create Workout
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/friends" className="nav-link">
              Friends
            </Link>
          </li>
        </ul>
        {cookies.token != null && (
          <>
            <span className="d-flex">
              <div className="d-flex" onClick={() => setIsOpen(true)}>
                <img
                  width={60}
                  height={60}
                  src={imageUrl}
                  onError={() => setImageUrl(EmptyPicture)}
                  className="rounded-circle"
                />
                <h5 className="text-white mx-3 mt-2">
                  {cookies.user.username}
                </h5>
              </div>
              <a className="mt-2 text-danger" onClick={logout}>
                logout
              </a>
            </span>
            <ImageModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              CurrentFile={imageUrl}
              upload={upload}
            />
          </>
        )}
      </nav>
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
    </>
  );
}
