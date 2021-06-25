import React, { useState, useEffect } from "react";
import "./Navigation.css";
import { Tabs, Tab } from "@material-ui/core";
import Faq from "../Faq/Faq";
import Instructions from "../Instructions/Instructions";
import Home from "../Home/index";
import { useDispatch } from "react-redux";
import {
  setLoginToken,
  setEmail,
  set_userFilter,
} from "../../redux/actions/actions";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import PropTypes from "prop-types";
import KaggleDashBoard from "../KaggleDashboard/KaggleDashboard";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

export default function Navigation(props) {
  let history = useHistory();
  const fname = useSelector((state) => state.loginReducer.email);
  const dispatch = useDispatch();
  const classes = useStyles();
  let userFilter = useSelector((state) => state.kaggleReducer.userFilter);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedTab, setSelectedTab] = useState(0);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  // eslint-disable-next-line no-unused-vars
  const [snackbarOpen, setSnackbarOpen] = useState(props.isUserNewlyRegistred);
  useEffect(() => {
    setSnackbarOpen(props.isUserNewlyRegistred);
  });

  React.useEffect(() => {
    setSnackbarOpen(props.isUserNewlyRegistred);
  }, [props.isUserNewlyRegistred]);
  React.useEffect(() => {
    setSnackBarContent({
      content: `${fname} successfuly registered as a guest user`,
      severity: "success",
    });
  }, [fname]);

  // eslint-disable-next-line no-unused-vars
  const [snackBarContent, setSnackBarContent] = useState({
    content: `${fname} successfuly registered as a guest user`,
    severity: "success",
  });

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    history.push({
      state: { isUserNewlyRegistred: false },
    });
    setSnackbarOpen(false);
  };

  const handleChange = (event, newValue) => {
    if (!userFilter) {
      dispatch(
        set_userFilter({
          dataFilter: "public",
          compFilter: "general",
        })
      );
    }
    setSelectedTab(newValue);
  };

  return (
    <div className={classes.root}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackBarContent.severity}
        >
          {snackBarContent.content}
        </Alert>
      </Snackbar>
      <AppBar position="static">
        <Toolbar>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid xs item>
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
            <Grid xs={8} item>
              <Grid container justify={"center"}>
                <div style={{ alignItems: "center" }}>
                  <Tabs
                    className="containerTab"
                    value={selectedTab}
                    onChange={handleChange}
                  >
                    <Tab label="Home" />
                    <Tab label="Instructions" />
                    <Tab label="FAQ" />
                    <Tab label="Kaggle Dashboard" />
                  </Tabs>
                </div>
              </Grid>
            </Grid>
            <Grid item xs style={{ textAlign: "end" }}>
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle /> {fname}
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem
                    onClick={() => {
                      dispatch(setLoginToken(""));
                      dispatch(setEmail(""));
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <>
        {selectedTab === 0 && <Home isLanding={false} />}
        {selectedTab === 0 && <Instructions />}
        {selectedTab === 1 && <Faq />}
        {selectedTab === 2 && (
          <KaggleDashBoard tab={selectedTab} setTab={setSelectedTab} />
        )}
      </>
    </div>
  );
}
Navigation.propTypes = {
  isUserNewlyRegistred: PropTypes.bool,
};
