import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EmptyPicture from "../../logos/profile.jpg";
import ImageModal from "./ImageModal";

export default function Navbar({ cookies, logout }) {
  const [isOpen, setIsOpen] = useState(false);
  const ProfileUrl = `http://10.0.0.19:4000/user/${cookies.user.UserID}/profile`;
  const [imageUrl, setImageUrl] = useState(ProfileUrl);
  useEffect(() => setImageUrl(ProfileUrl + "?" + Date.now()), [isOpen]);

  return (
    <nav className="p-3 navbar navbar-dark bg-primary navbar-expand-lg justify-content-between sticky-top">
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
              <h5 className="text-white mx-3 mt-2">{cookies.user.username}</h5>
            </div>
            <a className="mt-2 text-danger" onClick={logout}>
              logout
            </a>
          </span>
          <ImageModal
            cookies={cookies}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            CurrentImage={imageUrl}
          />
        </>
      )}
    </nav>
  );
}
