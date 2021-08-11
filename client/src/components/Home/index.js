import React from "react";
import "./index.css";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
//import Fab from "@material-ui/core/Fab";
import Grow from "@material-ui/core/Grow";
import ControlDashboard from "../ControlDashboard/ControlDashboard";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
//import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
//import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DescriptionIcon from "@material-ui/icons/Description";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import GetAppIcon from "@material-ui/icons/GetApp";

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
    marginLeft: 65,
  },
  media: {
    height: 150,
    maxWidth: 250,
  },
});

const Home = (props) => {
  // const [show, setShow] = useState(false);
  const classes = useStyles();

  return (
    <Grow in={true}>
      <div className="App">
        {/* <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="center"
        >
          <img width="150" height="150" src="../logo.png" />
        </Grid> */}

        {!props.isLanding && (
          <ControlDashboard setTab={props.setTab}></ControlDashboard>
        )}

        <br />
        <hr />

        <br />
        <br />
        <br />
        {props.isLanding && (
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            alignContent="center"
          >
            <Card className={classes.root}>
              <CardActionArea>
                <br />
                <br />
                <Typography align="center" display="block">
                  <CardMedia
                    className={classes.media}
                    title="AutoML"
                    component="img"
                    alt="AutoML"
                    height="150"
                    width="150"
                    image="../logo.png"
                  />
                </Typography>
                <CardContent>
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    component="p"
                    align="justify"
                  >
                    AutoML is an online platform that uses an ensemble of
                    state-of-the-art AutoML systems to find the best model to
                    describe your data. AutoML is a technique for intelligently
                    trying and selecting models in order to perform predictions,
                    regressions, and classifications. The models considered in
                    this ensemble range from artificial neural networks to
                    simple linear regression, and everything in between such as
                    random forests, support vector machines, and principal
                    component analysis. Once our system has found a best model,
                    it can be used for lightning fast inference of any future
                    samples of the dataset.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            <br />
            <br />
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              alignContent="center"
              justifyContent="center"
            >
              <Grid xs={12} item>
                <h1> As easy as 1... 2... 3</h1>
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
            </Grid>

            <Grid></Grid>
          </Grid>
        )}
      </div>
    </Grow>
  );
};

Home.propTypes = {
  isLanding: PropTypes.bool,
  setTab: PropTypes.func,
};

export default Home;
