import React from "react";
import "./index.css";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import ControlDashboard from "../ControlDashboard/ControlDashboard";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import ListRegular from "./ListRegular";
import ListPremium from "./ListPremium";
import StepsVisual from "./StepsVisual";

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 400,
    marginLeft: 65,
  },
  media: {
    height: 150,
    maxWidth: 250,
    marginLeft: 50,
  },
}));

const Home = (props) => {
  const classes = useStyles();
  return (
    <Grow in={true}>
      <div className="App">
        {!props.isLanding && (
          <ControlDashboard setTab={props.setTab}></ControlDashboard>
        )}
        <br />
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
            <br />
            <br />
            <br />
            <br />
            <br />
            <StepsVisual />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={2} />
              <Grid item xs={12} md={4}>
                <ListRegular />
              </Grid>
              <Grid item xs={12} md={4}>
                <ListPremium />
              </Grid>
            </Grid>
            <br />
            <br />
            <br />
            <br />
            <br />
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
