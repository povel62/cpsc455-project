import React, { Component } from "react";
import Home from "./components/Home";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          {/* <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/topics">Topics</Link>
            </li>
          </ul> */}
          <hr />

          <Route exact path="/" component={Home} />
          <Route exact path="/" component={Signup} />
          <Route exact path="/" component={Login} />
          {/* <Route path="/about" component={About} />
        <Route path="/topics" component={Topics} /> */}
        </div>
      </Router>
    );
  }
}

export default App;
