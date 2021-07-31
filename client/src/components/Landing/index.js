import React, { useState } from "react";
import { Tabs, Tab } from "@material-ui/core";
import Home from "../Home/index";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
import Signup from "../Signup/Signup";
import SignIn from "../Signin/Signin";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Landing() {
  let history = useHistory();
  const [selectedTab, setSelectedTab] = useState(-1);
  const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false);

  const classes = useStyles();

  const handleChange2 = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid xs={1} item>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                onClick={() => {
                  setSelectedTab(-1);
                  history.push({
                    pathname: "/",
                  });
                }}
              >
                <img width="50" height="50" src="../logo.png" />
              </IconButton>
            </Grid>
            <Grid xs={10} item>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="flex-start"
              >
                <Tabs
                  className="containerTab"
                  value={selectedTab}
                  onChange={handleChange2}
                  centered
                >
                  <Tab label="Sign In" />
                  <Tab label="Sign Up" />
                </Tabs>
              </Grid>
            </Grid>
            <Grid item xs={1} />
          </Grid>
        </Toolbar>
      </AppBar>
      <>
        {selectedTab === -1 && <Home isLanding={true} />}
        {selectedTab === 0 && (
          <SignIn
            signUpSuccessful={isSignUpSuccessful}
            callback={() => {
              handleChange2(undefined, 1);
            }}
          />
        )}
        {selectedTab === 1 && (
          <Signup
            callback={(e) => {
              setIsSignUpSuccessful(e);
              handleChange2(undefined, 0);
            }}
          />
        )}
      </>
    </div>
  );
}
