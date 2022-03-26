import React, { useEffect,useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useCookies } from "react-cookie";
import SignUp from "./pages/AuthPages/SignUp";
import Login from "./pages/AuthPages/Login";
import Base from "./pages/Extras/Base";
import Home from "./pages/UserView/pages/Home";
import FriendWorkouts from "./pages/UserView/pages/FriendWorkouts";

import Create from "./pages/Extras/Create";
import Workout from "./pages/Workouts/Pages/Workout";
import Friends from "./pages/Friends/pages/Friends";
import Requests from "./pages/Friends/pages/Requests";
import NavBar from "./NavBarComponents/NavBar";
import { Route, Routes } from "react-router-dom";
import Messages from "./pages/Friends/pages/Messages";
import { useNavigate } from "react-router-dom";
function App() {
  const Navigate = useNavigate();
  const [cookies, _, removeCookies] = useCookies(["user", "token"]);
  const [workoutUpdated, setWorkoutUpdated] = useState(null);
  useEffect(() => {
    const subPaths = window.location.href.split("/");
    const path = subPaths[3].toLowerCase();
    if (cookies.token && cookies.user) {
      if (path == "signin" || path == "login") {
        Navigate("/Home", { replace: true });
      }
    } else if ((path != "signup" && path != "login") || subPaths.length != 4) {
      logout();
    }
  });
  function logout() {
    removeCookies("token", { path: "/" });
    removeCookies("user", { path: "/" });
    Navigate("/Login", { replace: true });
  }
  return (
    <div className="container">
      {cookies.user && cookies.token && (
        <NavBar
          cookies={cookies}
          logout={logout}
          setWorkoutUpdated={setWorkoutUpdated}
        />
      )}
      <Routes>
        <Route exact path="/Login" element={<Login />} />
        <Route exact path="/SignUp" element={<SignUp />} />
        <Route exact path="/" element={<Base />} />
        <Route
          exact
          path="/home"
          element={
            <Home
              setWorkoutUpdated={setWorkoutUpdated}
              workoutUpdated={workoutUpdated}
            />
          }
        />

        <Route exact path="/workouts/create" element={<Create />} />

        <Route exact path="/workouts/:id" element={<Workout />} />
        <Route exact path="/friends" element={<Friends />} />
        <Route exact path="/requests" element={<Requests />} />
        <Route exact path="/friends/:id" element={<FriendWorkouts />} />
        <Route exact path="/messages/:id" element={<Messages />} />
      </Routes>
    </div>
  );
}
export default App;
