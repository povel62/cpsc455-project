import React, { useState } from "react";
/*import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../redux/actions/actions";*/
//import { useSelector, useDispatch } from "react-redux";

const Login = () => {
  const [values, setValues] = useState({
    response: "",
    post: "",
    responseToPost: "",
    username: "",
    pwd: "",
  });

  /*
  const username = useSelector((values) => values.username);
  const currentUser = useSelector((values) => values.currentUser);

  const dispatch = useDispatch();

  const user = { name: "Rei" };

  useEffect(() => {
    dispatch(allActions.userActions.setUser(user));
  }, []);
  */

  //const [username, setUsername] = useState("")
  //const [pwd, setPwd] = useState("")

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
    alert(body);
    setValues({ ...values, responseToPost: body });
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
      </form>
    </div>
  );
};

export default Login;
