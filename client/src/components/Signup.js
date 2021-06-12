import React, { useState } from "react";
import "../css/Signup.css";

const Signup = () => {
  const [values, setValues] = useState({
    response: "",
    post: "",
    responseToPost: "",
    username: "",
    guest: true,
    pwd: "",
    firstname: "",
    lastname: "",
    dob: "",
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
        email: values.username,
        password: values.pwd,
        dob: values.dob,
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
    <div className="signupContainer">
      <div className="signupPage">
        <h1>SIGNUP PAGE</h1>
        <form>
          <label>First Name</label>
          <input
            type="text"
            onChange={(e) =>
              setValues({ ...values, firstname: e.target.value })
            }
          ></input>
          <br />
          <label>Last Name</label>
          <input
            type="text"
            onChange={(e) => setValues({ ...values, lastname: e.target.value })}
          ></input>
          <br />
          <label>e-mail</label>
          <input
            type="text"
            onChange={(e) => setValues({ ...values, username: e.target.value })}
          ></input>
          <br />
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setValues({ ...values, pwd: e.target.value })}
          ></input>
          <br />
          <label>DOB</label>
          <input
            type="date"
            onChange={(e) => setValues({ ...values, dob: e.target.value })}
          ></input>
          <br />
          <button type="submit" onClick={signup_handler}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
