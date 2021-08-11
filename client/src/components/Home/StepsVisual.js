import React from "react";
import "./index.css";
import Grid from "@material-ui/core/Grid";
import DescriptionIcon from "@material-ui/icons/Description";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import GetAppIcon from "@material-ui/icons/GetApp";

const StepsVisual = () => {
  return (
    <>
      <Grid
        className="skyBreak"
        container
        direction="row"
        justify="center"
        alignItems="center"
        alignContent="center"
        justifyContent="center"
      >
        <Grid xs={12} item>
          <br />
          <br />
          <h1> Finding best fit model to make predictions with AutoML is</h1>
          <h1> as easy as 1... 2... 3</h1>
        </Grid>
        <Grid xs={12} sm={2} item />
        <Grid xs={12} sm={3} item>
          <div className="circle_1">
            <DescriptionIcon style={{ color: "white", fontSize: "80" }} />
          </div>
        </Grid>
        <Grid xs={12} sm={3} item>
          <div className="circle_2">
            <DonutLargeIcon style={{ color: "white", fontSize: "80" }} />
          </div>
        </Grid>
        <Grid xs={12} sm={3} item>
          <div className="circle_3">
            <GetAppIcon style={{ color: "white", fontSize: "80" }} />
          </div>
        </Grid>

        <Grid xs={12} sm={2} item />
        <Grid xs={12} sm={3} item>
          <div className="circle_text">
            <h3>Submit Dataset and start Training</h3>
          </div>
        </Grid>
        <Grid xs={12} sm={3} item>
          <div className="circle_text">
            <h3>Submit Testing set and start predicting</h3>
          </div>
        </Grid>
        <Grid xs={12} sm={3} item>
          <div className="circle_text">
            <h3>Download Prediction results</h3>
          </div>
        </Grid>
        <br />
        <br />
        <br />
        <br />
      </Grid>
    </>
  );
};

export default StepsVisual;
