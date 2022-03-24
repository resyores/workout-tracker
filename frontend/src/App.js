import React, { useEffect } from "react";
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css";
import { useCookies } from "react-cookie";
import SignUp from "./pages/AuthPages/SignUp";
import Login from "./pages/AuthPages/Login";
import Base from "./pages/Base";
import Home from "./pages/Home";
import Create from "./pages/WorkoutPages/Create";
import Workout from "./pages/WorkoutPages/Workout";
import FriendWorkouts from "./pages/FriendPages/FriendWorkouts";
import Friends from "./pages/FriendPages/Friends";
import Requests from "./pages/FriendPages/Requests";
import NavBar from "./components/complex/NavBar";
import { Route, Routes } from "react-router-dom";
import Messages from "./pages/FriendPages/Messages";
import { useNavigate } from "react-router-dom";
function App() {
  const Navigate = useNavigate();
  const [cookies, _, removeCookies] = useCookies(["user", "token"]);
  useEffect(() => {
    const subPaths = window.location.href.split("/");
    const path = subPaths[3].toLowerCase();
    if (cookies.token && cookies.user) {
      if (path == "signin" || path == "login") {
        Navigate("/Home", { replace: true });
      }
    } else if ((path != "signin" && path != "login") || subPaths.length != 4) {
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
        <NavBar cookies={cookies} logout={logout} />
      )}
      <Routes>
        <Route exact path="/Login" element={<Login />} />
        <Route exact path="/SiggnUp" element={<SignUp />} />
        <Route exact path="/" element={<Base />} />
        <Route exact path="/home" element={<Home />} />

        <Route exact path="/workouts/create" element={<Create />} />

        <Route exact path="/workouts/:id" element={<Workout />} />
        <Route exact path="/friends" element={<Friends />} />
        <Route exact path="/requests" element={<Requests />} />
        <Route exact path="/friends/:id" element={<FriendWorkouts />} />
        <Route exact path="/messages/:id" element={<Messages/>}/> 
      </Routes>
    </div>
  );
}
export default App;
