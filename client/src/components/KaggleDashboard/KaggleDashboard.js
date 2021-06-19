import { Grid } from "@material-ui/core";
import React from "react";
import KaggleActionPane from "./KaggleActionPane";
import "./KaggleDashboard.css";
import KaggleDataPane from "./KaggleDataPane";
import KaggleSearchPane from "./KaggleSearchPane";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const KaggleDashBoard = () => {
  const classes = useStyles();
  let loading = useSelector((state) => state.kaggleReducer.loading);
  return (
    <div className="KaggleDash">
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <br />
      <Grid container spacing={3}>
        <Grid item xs>
          <KaggleSearchPane />
        </Grid>
        <Grid item xs>
          <KaggleDataPane />
        </Grid>
        <Grid item xs>
          <KaggleActionPane />
        </Grid>
      </Grid>
    </div>
  );
};

export default KaggleDashBoard;
