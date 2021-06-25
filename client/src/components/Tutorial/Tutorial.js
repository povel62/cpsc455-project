import React from "react";
import "./Tutorial.css";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useHistory, withRouter } from "react-router-dom";

//function Navigation(props) {

//import { createBrowserHistory } from "history";
// import Step from "./Step";
// import Overview from "./Overview";
//import { useState } from "react";

const Tutorial = () => {
  // const [show, setShow] = useState(false);

  // const showModal = () => {
  //   //loadDetails();
  //   setShow(true);
  // };

  // const hideModal = () => {
  //   setShow(false);
  // };

  // const [overview, setOverview] = useState(false);

  // const hideOverview = () => {
  //   //loadDetails();
  //   setOverview(false);
  // };

  // const navigate = () => {
  //   createBrowserHistory.push("../Instructions.Instructions.js");
  // };

  const history = useHistory();

  const redirect = (path) => {
    history.push(path);
  };

  const showOverview = () => {
    var iframe = document.getElementById("iframe_overview");
    iframe.style.visibility = "visible";
  };

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
      <div>
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
            {/* <Step show={show} handleClose={hideModal}>
            <p></p>
          </Step> */}
            <Button
              size="small"
              onClick={() => redirect("../Instructions/Instructions.js")}
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
            {/* <Overview show={overview} handleClose={hideOverview}>
            <p></p>
        </Overview> */}
            <Button size="small" onClick={showOverview}>
              Learn More
            </Button>
          </CardActions>
        </Card>
        <br />
        <br />
      </div>
      <div>
        <iframe
          width="600"
          height="800"
          src="https://www.youtube.com/embed/llqWTJGUFeE"
          id="iframe_overview"
          visibility="hidden"
        ></iframe>
      </div>
      <div>
        <iframe
          width="600"
          height="800"
          src="../Instructions/Instructions"
          visibility="hidden"
        ></iframe>
      </div>
    </div>
  );
};

export default withRouter(Tutorial);
