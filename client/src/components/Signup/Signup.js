import React, { useState } from "react";
import "./Signup.css";
import Button from "@material-ui/core/Button";

const Signup = () => {
  const [values, setValues] = useState({
    response: "",
    post: "",
    responseToPost: "",
    email: "",
    guest: true,
    pwd: "",
    firstname: "",
    lastname: "",
    kusername: "",
    kapi: "",
  });

  const signup_handler = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guest: values.guest,
        fname: values.firstname,
        lname: values.lastname,
        email: values.email,
        password: values.pwd,
        kusername: values.kusername,
        kapi: values.kapi,
      }),
    });

    const body = await response.text();
    if (JSON.parse(body)["success"]) {
      alert("Signed up!!");
      setValues({ ...values, responseToPost: body });
    } else {
      alert(body);
    }
  };

  return (
    <div className="signupPage">
      <h1>SIGNUP PAGE</h1>
      <form>
        <input
          type="text"
          placeholder="First Name"
          onChange={(e) => setValues({ ...values, firstname: e.target.value })}
        ></input>
        <br />
        <input
          type="text"
          placeholder="Last Name"
          onChange={(e) => setValues({ ...values, lastname: e.target.value })}
        ></input>
        <br />
        <input
          type="text"
          placeholder="e-mail"
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        ></input>
        <br />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setValues({ ...values, pwd: e.target.value })}
        ></input>
        <br />
        <input
          type="text"
          placeholder="kaggle Username"
          onChange={(e) => setValues({ ...values, kusername: e.target.value })}
        ></input>
        <br />
        <input
          type="text"
          placeholder="kaggle API"
          onChange={(e) => setValues({ ...values, kapi: e.target.value })}
        ></input>
        <br />
        <hr />
        <Button
          type="submit"
          onClick={signup_handler}
          variant="contained"
          color="primary"
          component="span"
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default Signup;
