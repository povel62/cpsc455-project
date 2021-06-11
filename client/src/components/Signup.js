import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../redux/actions/actions";
import {useSelector, useDispatch} from 'react-redux'

import React, { Component } from "react";

const Signup = () => {
  const [values, setValues] = useState({
    response: "",
    post: "",
    responseToPost: "",
    username: "",
    pwd: "",
  });

  const username = useSelector(values => values.username)
  const currentUser = useSelector(values => values.currentUser)

  const dispatch = useDispatch()

  const user = {name: "Rei"}

  useEffect(() => {
    dispatch(allActions.userActions.setUser(user))
  }, [])

  const signup_handler = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/user", {
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
    <div className="signupPage">
        <h1>SIGNUP PAGE</h1>
        <form>
          <label>First Name</label>
          <input type="text"></input>
          <br />
          <label>Last Name</label>
          <input type="text"></input>
          <br />
          <label>e-mail</label>
          <input type="text"></input>
          <br />
          <label>Password</label>
          <input type="text"></input>
          <br />
          <label>Confirm Password</label>
          <input type="text"></input>
          <br />
          <label>DOB</label>
          <input type="date"></input>
          <br />
          <button type="submit" onClick={signup_handler}>
            Sign Up
          </button>
        </form>
      </div>
  );
};

export default Signup;

