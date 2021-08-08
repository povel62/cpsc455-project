import React, { useState } from "react";
import "./Tutorial.css";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Instructions from "../Instructions/Instructions";

const Tutorial = () => {
  const [show, setShow] = useState(false);

  const [overview, setOverview] = useState(false);

  const useStyles = makeStyles({
    root: {
      minWidth: 275,
      minHeight: 300,
      maxWidth: 300,
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
      <div className="upper_box">
        <Card className={classes.root} variant="outlined" alignSelf="center">
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              1
            </Typography>
            <Typography variant="h5" component="h2">
              Step-by-Step Tutorial
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={() => {
                setShow(true);
                setOverview(false);
              }}
            >
              Learn More
            </Button>
          </CardActions>
        </Card>

        <Card className={classes.root} variant="outlined" alignSelf="center">
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              2
            </Typography>
            <Typography variant="h5" component="h2">
              Workflow Overview
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={() => {
                setOverview(true);
                setShow(false);
              }}
            >
              Learn More
            </Button>
          </CardActions>
        </Card>
        <br />
        <br />
      </div>
      <div className="bottom_box">
        {overview ? (
          <iframe
            width="1280"
            height="720"
            src="https://www.youtube.com/embed/llqWTJGUFeE"
            id="iframe_overview"
          ></iframe>
        ) : null}

        {show ? <Instructions /> : null}
      </div>
    </div>
  );
};

export default Tutorial;
