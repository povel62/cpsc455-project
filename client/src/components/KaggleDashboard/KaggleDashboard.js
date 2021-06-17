import { Grid } from "@material-ui/core";

import React from "react";
import KaggleActionPane from "./KaggleActionPane";

import "./KaggleDashboard.css";
import KaggleDataPane from "./KaggleDataPane";

import KaggleSearchPane from "./KaggleSearchPane";

const KaggleDashBoard = () => {
  return (
    <div className="KaggleDash">
      <Grid container spaceing={3}>
        <Grid item xs>
          <KaggleSearchPane />
        </Grid>
        <Grid item xs>
          <KaggleDataPane />
          {/* TODO put a standard list if selected is not -1, get list of data from redux */}
        </Grid>
        <Grid item xs>
          <KaggleActionPane />
          {/* TODO a widget with buttons to do actions with datasets from kaggle to do ops from notepad */}
        </Grid>
      </Grid>
    </div>
  );
};

export default KaggleDashBoard;
