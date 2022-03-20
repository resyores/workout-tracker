import React from "react";
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
import { useNavigate } from "react-router-dom";
function App() {
  const Navigate = useNavigate();
  const [cookies, _, removeCookies] = useCookies();
  function logout() {
    removeCookies("token");
    removeCookies("user");
    Navigate("/Login", { replace: true });
  }
  return (
    <div className="container">
      {cookies.user && cookies.token && (
        <NavBar cookies={cookies} logout={logout} />
      )}
      <Routes>
        <Route exact path="/Login" element={<Login />} />
        <Route exact path="/SignUp" element={<SignUp />} />
        <Route exact path="/" element={<Base />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/workouts/create" element={<Create />} />
        <Route exact path="/friends" element={<Friends />} />
        <Route exact path="/friends/requests" element={<Requests />} />
        <Route exact path="/friends/:id" element={<FriendWorkouts />} />
        <Route path="/workouts/:id" element={<Workout />} />
      </Routes>
    </div>
  );
}
export default App;
