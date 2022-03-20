import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyPicture from "../../logos/profile.jpg";
export default function Workout({ friend, clickable }) {
  const Navigate = useNavigate();
  const ProfileUrl = `http://10.0.0.19:4000/user/profile/${friend.UserId}`;
  const [imageUrl, setImageUrl] = useState(ProfileUrl);
  const toPage = () => {
    if (clickable) Navigate("/friends/" + friend.UserId, { replace: true });
  };
  return (
    <div
      className="d-flex list-group-item list-group-item-action rounded mt-2 bg-info"
      onClick={toPage}
    >
      <img
        width={60}
        height={60}
        className="rounded-circle"
        src={imageUrl}
        onError={() => setImageUrl(EmptyPicture)}
      />
      <div className="d-flex justify-content-between mx-5">
        <h4 className="mx-4">{friend.UserName}</h4>
        <p>{friend.Email}</p>
      </div>
    </div>
  );
}
