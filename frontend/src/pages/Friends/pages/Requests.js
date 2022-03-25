import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Friend from "../Components/FriendRow";
export default function Friends() {
  const Navigate = useNavigate();
  const [cookies, _] = useCookies(["user", "token"]);
  const [invites, setInvites] = useState([]);
  useEffect(Start, []);
  function Start() {
    axios.defaults.headers.common["authorization"] = "bearer " + cookies.token; // for all requests
    axios.get("http://10.0.0.19:4000/invites").then((res) => {
      setInvites(res.data);
    });
  }
  function proccess(InviterId, accept) {
    let action = "reject";
    if (accept) action = "accept";
    axios
      .post("http://10.0.0.19:4000/invites/" + InviterId + "/" + action)
      .then((res) => {
        setInvites(invites.filter((invite) => invite.InviterId != InviterId));
      });
  }
  if (invites.length)
    return invites.map((invite) => {
      return (
        <div className="d-flex w-75">
          <Friend
            friend={{
              UserName: invite.UserName,
              Email: invite.Email,
              UserId: invite.InviterId,
            }}
            clickable={true}
          />
          <Button
            size="lg"
            onClick={() => {
              proccess(invite.InviterId, true);
            }}
            className="rounded btn-sm btn h-25 mt-4 btn-light btn-outline-success"
          >
            accept
          </Button>
          <Button
            size="lg"
            onClick={() => {
              proccess(invite.InviterId, false);
            }}
            className="rounded btn-sm btn h-25  mt-4 btn-light btn-outline-danger"
          >
            reject
          </Button>
        </div>
      );
    });
  return <h2 className="text-muted text-center mt-4">No current requests</h2>;
}
