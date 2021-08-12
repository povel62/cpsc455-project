import React, { useState } from "react";
import "./Tutorial.css";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Instructions from "../Instructions/Instructions";
import Grid from "@material-ui/core/Grid";

const Tutorial = () => {
  const [overview, setOverview] = useState(0);

  const useStyles = makeStyles({
    root: {
      width: 200,
      height: 200,
      paddingLeft: 20,
      paddingRight: 20,
      margin: 20,
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },
    title: {
      fontSize: 14,
    },
    pos: {},
  });

  const classes = useStyles();

  return (
    <div className="container">
      <Grid className="skyBreak" container direction="row" justify="center">
        <Grid xs={12} sm={4} item>
          <Card className={classes.root} variant="outlined" alignSelf="center">
            <CardActions>
              <Button
                size="small"
                onClick={() => {
                  setOverview(1);
                }}
              >
                Learn More
              </Button>
            </CardActions>
            <CardContent>
              <Typography variant="h5" component="h2">
                Step-by-Step Tutorial
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={4} item>
          <Card className={classes.root} variant="outlined" alignSelf="center">
            <CardActions>
              <Button
                size="small"
                onClick={() => {
                  setOverview(2);
                }}
              >
                Learn More
              </Button>
            </CardActions>
            <CardContent>
              <Typography variant="h5" component="h2">
                Submit/Add Job for training
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={4} item>
          <Card className={classes.root} variant="outlined" alignSelf="center">
            <CardActions>
              <Button
                size="small"
                onClick={() => {
                  setOverview(3);
                }}
              >
                Learn More
              </Button>
            </CardActions>
            <CardContent>
              <Typography variant="h5" component="h2">
                Submit Test data for prediction
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={4} item>
          <Card className={classes.root} variant="outlined" alignSelf="center">
            <CardActions>
              <Button
                size="small"
                onClick={() => {
                  setOverview(4);
                }}
              >
                Learn More
              </Button>
            </CardActions>
            <CardContent>
              <Typography variant="h5" component="h2">
                Download predicted results
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={4} item>
          <Card className={classes.root} variant="outlined" alignSelf="center">
            <CardActions>
              <Button
                size="small"
                onClick={() => {
                  setOverview(5);
                }}
              >
                Learn More
              </Button>
            </CardActions>
            <CardContent>
              <Typography variant="h5" component="h2">
                Kaggle Dashboard
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <br />
      <br />
      <div className="bottom_box">
        {overview == 1 && <Instructions />}
        {overview == 2 && (
          <iframe
            width="1280"
            height="720"
            src="https://www.youtube.com/embed/ifIlN_13Sec"
            id="iframe_overview"
          />
        )}
        {overview == 3 && (
          <iframe
            width="1280"
            height="720"
            src="https://www.youtube.com/embed/gJoyMVRxvow"
            id="iframe_overview"
          />
        )}
        {overview == 4 && (
          <iframe
            width="1280"
            height="720"
            src="https://www.youtube.com/embed/XNDmu2EuGvM"
            id="iframe_overview"
          />
        )}
        {overview == 5 && (
          <iframe
            width="1280"
            height="720"
            src="https://www.youtube.com/embed/i0Yj3BHY6kc"
            id="iframe_overview"
          />
        )}
      </div>
    </div>
  );
};

export default Tutorial;
