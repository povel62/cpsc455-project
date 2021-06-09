import React, { Component } from "react";

export default class Login extends Component {
  render() {
    const login_handler = (e) => {
      e.preventDefault();
      alert("hi from login");
    };
    return (
      <div className="loginPage">
        <h1>LOGIN PAGE</h1>
        <form>
          <label>e-mail</label>
          <input type="text"></input>
          <br />
          <label>Password</label>
          <input type="text"></input>
          <br />
          <button type="submit" onClick={login_handler}>
            Login
          </button>
        </form>
      </div>
    );
  }
}
