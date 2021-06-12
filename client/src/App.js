import React, { Component } from "react";
import Home from "./components/Home";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Error from "./components/Error";
import Navigation from "./components/Navigation";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Navigation />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route component={Error} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
