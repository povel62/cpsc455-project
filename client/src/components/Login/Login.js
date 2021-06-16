import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { has_login_token } from "../../redux/actions/actions";
import "./Login.css";
import Button from "@material-ui/core/Button";

const Login = () => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    response: "",
    post: "",
    responseToPost: "",
    username: "",
    pwd: "",
  });

  const login_handler = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: values.username, password: values.pwd }),
    });

    const body = await response.text();
    setValues({ ...values, responseToPost: body });
    if (JSON.parse(body)["accessToken"]) {
      const accessToken = JSON.parse(body)["accessToken"];
      dispatch(has_login_token(accessToken));
      alert("Welcome");
    } else {
      alert("wrong username or password");
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginPage">
        <h1>LOGIN PAGE</h1>
        <form>
          <input
            type="text"
            id="email_text"
            placeholder="e-mail"
            onChange={(e) => setValues({ ...values, username: e.target.value })}
          ></input>
          <br />
          <input
            type="password"
            placeholder="password"
            id="password_text"
            onChange={(e) => setValues({ ...values, pwd: e.target.value })}
          ></input>
          <hr />
          <Button
            type="submit"
            onClick={login_handler}
            variant="contained"
            color="primary"
            component="span"
          >
            Login
          </Button>
          <br />
        </form>
      </div>
    </div>
  );
};

export default Login;
