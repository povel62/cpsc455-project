import React, { Component } from "react";

export default class Signup extends Component {
  render() {
    const signup_handler = async (e) => {
      e.preventDefault();
      const response = await fetch("/api/hello");
      alert(await response.text());
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
          <button type="submit" onClick={signup_handler}>
            Sign Up
          </button>
        </form>
      </div>
    );
  }
}
