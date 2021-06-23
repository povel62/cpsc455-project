import React from "react";
import "./Tutorial.css";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const Tutorial = () => {
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
  // const bull = <span className={classes.bullet}>•</span>;
  const stepClickHandler = () => {};
  const overviewClickHandler = () => {};
  return (
    <div className="container">
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
          <Button size="small" onClick={stepClickHandler}>
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
            Tutorial Overview
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={overviewClickHandler}>
            Learn More
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default Tutorial;
