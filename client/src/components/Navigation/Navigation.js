import React from "react";
import "./Navigation.css";
import { Tabs, Tab } from "@material-ui/core";
import Signup from "../Signup/Signup";
import Faq from "../Faq/Faq";
import Instructions from "../Instructions/Instructions";
import Login from "../Login/Login";
import Home from "../Home/index";
import Signin from "../Signin/Signin";

const Navigation = () => {
  const [selectedTab, setselectedTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setselectedTab(newValue);
  };

  return (
    <div>
      <Tabs
        className="containerTab"
        value={selectedTab}
        onChange={handleChange}
        inkBarStyle={{ background: "blue" }}
      >
        <Tab label="Home" />
        <Tab label="Instructions" />
        <Tab label="FAQ" />
        <Tab label="Sign up" />
        <Tab label="Login" />
        <Tab label="Signin" />
      </Tabs>
      {selectedTab === 0 && <Home />}
      {selectedTab === 1 && <Instructions />}
      {selectedTab === 2 && <Faq />}
      {selectedTab === 3 && <Signup />}
      {selectedTab === 4 && <Login />}
      {selectedTab === 5 && <Signin />}
    </div>
  );
};

export default Navigation;
