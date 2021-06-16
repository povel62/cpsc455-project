import React, { Component } from "react";
import "./css/App.css";
import Navigation from "./components/Navigation/Navigation";

class App extends Component {
  render() {
    return (
      <div className="root">
        <Navigation />
      </div>
    );
  }
}

export default App;
