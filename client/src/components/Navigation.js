import React from "react";
import "../css/Navigation.css";
import { Tabs, Tab } from "@material-ui/core";
import Signup from "./Signup";
import Login from "./Login";
import Home from "./Home/index";

const Navigation = () => {
  const [selectedTab, setselectedTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setselectedTab(newValue);
  };

  return (
    <div>
      <Tabs value={selectedTab} onChange={handleChange}>
        <Tab label="Home" />
        <Tab label="Sign up" />
        <Tab label="Login" />
      </Tabs>
      {selectedTab === 0 && <Home />}
      {selectedTab === 1 && <Signup />}
      {selectedTab === 2 && <Login />}
    </div>
  );
};

export default Navigation;
