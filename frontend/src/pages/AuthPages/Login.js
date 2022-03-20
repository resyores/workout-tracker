import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Field from "../../components/BaseComponents/Field";
import Modal from "../../components/BaseComponents/Modal";
import { Link, useNavigate } from "react-router-dom";
import "../../css/form.css";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function Login() {
  const Navigate = useNavigate();
  const [cookies, setCookie] = useCookies();
  useEffect(CheckIfToken, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  function validateForm(email, password) {
    return email.length > 0 && password.length > 0;
  }
  function CheckIfToken() {
    if (cookies.token) Navigate("/Home", { replace: true });
  }
  function handleSubmit(event) {
    event.preventDefault();
    axios
      .post("http://10.0.0.19:4000/Auth/Login", { email, password })
      .then((res) => {
        if (res.data.isAuth) {
          setCookie("token", res.data.token, { path: "../" });
          setCookie("user", res.data.user, { path: "../" });
          Navigate("/Home", { replace: true });
        }
      })
      .catch((err) => {
        console.log(err.response.status);
        if (err.response.status == 400) {
          reset(err.response.data);
        }
      });
  }
  function reset(error) {
    setError(error);
    setEmail("");
    setPassword("");
  }

  return (
    <div className="Login">
      <Modal open={error.length}>
        <div className="col text-center">
          <h4>{error}</h4>
          <Button
            className="btn-secondary w-25 mt-3"
            onClick={() => {
              setError("");
            }}
          >
            close
          </Button>
        </div>
      </Modal>
      <Form onSubmit={handleSubmit}>
        <Field
          Name="email"
          Label="Email"
          Type="email"
          value={email}
          setter={setEmail}
        />
        <Field
          Name="password"
          Label="Password"
          Type="password"
          value={password}
          setter={setPassword}
        />
        <Button
          block
          size="lg"
          type="submit"
          disabled={!validateForm(email, password)}
          className="submit-btn"
        >
          Login
        </Button>
        <Link to="/SignUp">Create an account</Link>
      </Form>
    </div>
  );
}
