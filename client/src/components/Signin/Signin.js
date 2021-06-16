import React, { useState } from "react";
import "./Signin.css";
import Signup from "../Signup/Signup";
import Login from "../Login/Login";
import Button from "@material-ui/core/Button";

const Signin = () => {
  const [showSignup, setIsUser] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  return (
    <div className="containerSignin">
      {showSignup ? <Signup /> : ""}
      {showLogin ? <Login /> : ""}
      <Button
        variant="contained"
        color="primary"
        component="span"
        onClick={() => {
          setIsUser(!showSignup);
          setShowLogin(!showLogin);
        }}
      >
        {showSignup ? "Log in" : "Sign up"}
      </Button>
    </div>
  );
};

export default Signin;
