import { Grid } from "@material-ui/core";

import React from "react";
import KaggleActionPane from "./KaggleActionPane";

import "./KaggleDashboard.css";
import KaggleDataPane from "./KaggleDataPane";

import KaggleSearchPane from "./KaggleSearchPane";

const KaggleDashBoard = () => {
  return (
    <div className="KaggleDash">
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
