import React, { useState } from "react";
import "./Navigation.css";
import { Tabs, Tab } from "@material-ui/core";
import Faq from "../Faq/Faq";
import Instructions from "../Instructions/Instructions";
import Home from "../Home/index";
import { useDispatch } from "react-redux";
import { setLoginToken } from "../../redux/actions/actions";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
// import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
// import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Grid from "@material-ui/core/Grid";

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

export default function Navigation() {
  const fname = useSelector((state) => state.loginReducer.email);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedTab, setSelectedTab] = useState(0);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, newValue) => {
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
            <Grid xs item>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
              >
                AutoML
              </IconButton>
              {/* <Typography variant="h6" className={classes.title}>
               
              </Typography> */}
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
                  <MenuItem onClick={() => dispatch(setLoginToken(""))}>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <>
        {selectedTab === 0 && <Home />}
        {selectedTab === 1 && <Instructions />}
        {selectedTab === 2 && <Faq />}
      </>
    </div>
  );
}
