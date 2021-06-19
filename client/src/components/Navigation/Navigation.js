import React from "react";
import "./Navigation.css";
import { Tabs, Tab } from "@material-ui/core";
import Signup from "../Signup/Signup";
import Faq from "../Faq/Faq";
import Instructions from "../Instructions/Instructions";
import Login from "../Login/Login";
import Home from "../Home/index";
import KaggleDashBoard from "../KaggleDashboard/KaggleDashboard";
import { useDispatch, useSelector } from "react-redux";
import { set_userFilter } from "../../redux/actions/actions";

const Navigation = () => {
  let dispatch = useDispatch();
  const [selectedTab, setselectedTab] = React.useState(0);
  let userFilter = useSelector((state) => state.kaggleReducer.userFilter);

  const handleChange = (event, newValue) => {
    setselectedTab(newValue);
    if (!userFilter) {
      dispatch(
        set_userFilter({
          dataFilter: "public",
          compFilter: "general",
        })
      );
    }
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
        <Tab label="Kaggle Dashboard" />
      </Tabs>
      {selectedTab === 0 && <Home />}
      {selectedTab === 1 && <Instructions />}
      {selectedTab === 2 && <Faq />}
      {selectedTab === 3 && <Signup />}
      {selectedTab === 4 && <Login />}
      {selectedTab === 5 && <KaggleDashBoard />}
    </div>
  );
};

export default Navigation;
