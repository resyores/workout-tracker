import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Workout from "../../components/RowComponents/WorkoutRow";
import FriendRow from "../../components/RowComponents/FriendRow";
import Modal from "../../components/BaseComponents/Modal";
import useLoader from "../../Hooks/useLoader";
import SearchDiv from "../../components/complex/SearchDiv";
import useObserver from "../../Hooks/useObserver";

const WorkoutsView = ({
  workouts,
  query,
  message,
  lastWorkoutElementRef,
  handleSearch,
}) => {
  if (workouts.length || query.length)
    return (
      <>
        <SearchDiv handleSearch={handleSearch} query={query} />
        {workouts.map((workout, index) => {
          if (workouts.length - 1 == index)
            return (
              <span ref={lastWorkoutElementRef}>
                <Workout workout={workout} mine={false} />
              </span>
            );
          return <Workout workout={workout} mine={false} />;
        })}
      </>
    );
   return <h2 className="text-muted text-center mt-4">{message}</h2>;
};
export default function FriendWorkouts() {
  const Navigate = useNavigate();
  const id = parseInt(window.location.href.split("/")[4]);
  const [cookies, _] = useCookies();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friend, setFriend] = useState({});
  const [message, setMessage] = useState("User has no public workouts");
  const [isAuth, setIsAuth] = useState(false);
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [invited, setInvited] = useState(false);
  let targetUrl = cookies.user
    ? "http://10.0.0.19:4000/user/" + id + "/workouts"
    : "http://10.0.0.19:4000/exercises";
  const {
    loading,
    error,
    hasMore,
    items: workouts,
    setItems: __,
  } = useLoader(query, pageNumber, cookies.token, targetUrl);
  const lastWorkoutElementRef = useObserver(loading, hasMore, setPageNumber);
  function handleSearch(event) {
    setQuery(event.target.value);
    setPageNumber(1);
  }
  const ActionButton = ({ FriendId, friend, UserId, isAuth }) => {
    if (FriendId == UserId) return null;
    if (isAuth)
      return (
        <Button
          className="btn-danger h-50 mt-4 ms-3"
          onClick={() => unFriend(FriendId)}
        >
          UnFriend
        </Button>
      );
    if (invited)
      return (
        <div className="bg-success rounded h-50 mt-4 ms-3 p-2">Invited</div>
      );
    return (
      <Button
        className="btn-light btn-outline-primary h-50 mt-4 ms-3"
        onClick={() => Invite(friend)}
      >
        Request
      </Button>
    );
  };
  useEffect(Start, []);
  function Start() {
    const token = cookies.token;
    if (!token) Navigate("/Login", { replace: true });
    axios.defaults.headers.common["authorization"] = "bearer " + token; // for all requests
    axios
      .get("http://10.0.0.19:4000/user/" + id + "/userdata")
      .then((res) => {
        setFriend(res.data.userdata);
        if (res.data.isauth) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
          setMessage(
            "You can't view this user workouts beacuse you are not friends"
          );
          setInvited(res.data.invited);
        }
      })
      .catch((err) => {
        Navigate("/Home", { replace: true });
      });
  }
  function unFriend(id) {
    axios.delete("http://10.0.0.19:4000/friends/" + id).then((res) => {
      Navigate("/friends");
    });
  }
  function Invite(friend) {
    axios
      .post("http://10.0.0.19:4000/invites/add/" + friend.UserName)
      .then((res) => {
        setIsModalOpen(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setInvited(true);
        }, 1000);
      });
  }

  return (
    <>
      <div className="d-flex">
        <Modal open={isModalOpen}>
          <h2 className="text-success text-center mt-4">Requested</h2>
        </Modal>
        <FriendRow friend={{ ...friend, UserId: id }} clickable={false} />
        <ActionButton
          FriendId={id}
          UserId={cookies.user ? cookies.user.UserID : null}
          friend={friend}
          isAuth={isAuth}
        />
      </div>
      <WorkoutsView
        workouts={workouts}
        query={query}
        message={message}
        lastWorkoutElementRef={lastWorkoutElementRef}
        handleSearch={handleSearch}
      />
    </>
  );
}
