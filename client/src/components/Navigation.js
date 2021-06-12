import React from "react";
import "../css/Navigation.css";
import { Tabs, Tab } from "@material-ui/core";
import Signup from "./Signup";
import Faq from "./Faq";
import Instructions from "./Instructions";
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
        <Tab label="Instructions" />
        <Tab label="FAQ" />
        <Tab label="Sign up" />
        <Tab label="Login" />
      </Tabs>
      {selectedTab === 0 && <Home />}
      {selectedTab === 1 && <Instructions />}
      {selectedTab === 2 && <Faq />}
      {selectedTab === 3 && <Signup />}
      {selectedTab === 4 && <Login />}
    </div>
  );
};

export default Navigation;
