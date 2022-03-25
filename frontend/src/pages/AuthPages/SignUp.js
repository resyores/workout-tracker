import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Field from "../../BaseComponents/Field";
import Error from "../../BaseComponents/Error";
import { Link, useNavigate } from "react-router-dom";
import "../../css/form.css";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function SignUp() {
  const Navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["user", "token"]);
  useEffect(CheckIfToken, []);
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ index: -1, message: "" });
  function validateForm(email, username, password) {
    return email.length > 0 && password.length > 0 && username.length > 0;
  }
  function CheckIfToken() {
    const token = cookies.token;
    if (token) Navigate("/Home", { replace: true });
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (email.length < 5) {
      setError({
        index: 0,
        message: "Email has to be at least 5 characters long",
      });
      return;
    }
    if (username.length < 5) {
      setError({
        index: 1,
        message: "Username has to be at least 5 characters long",
      });
      return;
    }
    if (password.length < 5) {
      setError({
        index: 2,
        message: "Password has to be at least 5 characters long",
      });
      return;
    }
    axios
      .post("http://10.0.0.19:4000/Auth/SignUp", { username, email, password })
      .then((res) => {
        if (res.status == 201) {
          axios
            .post("http://10.0.0.19:4000/Auth/Login", { email, password })
            .then((res) => {
              if (res.data.isAuth) {
                setCookie("token", res.data.token, { path: "/" });
                setCookie("user", res.data.user, { path: "/" });
                Navigate("/Home", { replace: true });
              }
            });
        }
      })
      .catch((err) => {
        if (err.response.status == 400) {
          if (err.response.data.index == 0)
            setError({
              index: 0,
              message: "Email belongs to another user",
            });
          else if (err.response.data.index == 1)
            setError({
              index: 1,
              message: "UserName is taken",
            });
        }
      });
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Field
          Name="email"
          Label="Email"
          Type="email"
          value={email}
          setter={setEmail}
        />
        <Error error={error} index={0} />

        <Field
          Name="username"
          Label="UserName"
          Type="text"
          value={username}
          setter={setUserName}
        />
        <Error error={error} index={1} />
        <Field
          Name="password"
          Label="Password"
          Type="password"
          value={password}
          setter={setPassword}
        />
        <Error error={error} index={2} />
        <Button
          block
          size="lg"
          type="submit"
          disabled={!validateForm(email, username, password)}
          className="submit-btn"
        >
          Sign In
        </Button>
        <Link to="/Login">Already have an acount?</Link>
      </Form>
    </div>
  );
}
