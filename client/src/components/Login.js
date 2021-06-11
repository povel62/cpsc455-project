import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { has_login_token } from "../redux/actions/actions";

const Login = () => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    response: "",
    post: "",
    responseToPost: "",
    username: "",
    pwd: "",
  });

  // extract loginReducer
  const login_token = useSelector((state) => state.loginReducer);

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
      alert(accessToken);
    } else {
      alert("wrong username or password");
    }
    console.log("login_token:");
    console.log(login_token);
  };

  return (
    <div className="loginPage">
      <h1>LOGIN PAGE</h1>
      <form>
        <label>e-mail</label>
        <input
          type="text"
          id="email_text"
          onChange={(e) => setValues({ ...values, username: e.target.value })}
        ></input>
        <br />
        <label>Password</label>
        <input
          type="password"
          id="password_text"
          onChange={(e) => setValues({ ...values, pwd: e.target.value })}
        ></input>
        <br />
        <button type="submit" onClick={login_handler}>
          Login
        </button>
        <br />
      </form>
    </div>
  );
};

export default Login;
