import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import KaggleActionPane from "./KaggleActionPane";
import "./KaggleDashboard.css";
import KaggleDataPane from "./KaggleDataPane";
import KaggleSearchPane from "./KaggleSearchPane";
import {
  Backdrop,
  CircularProgress,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { KaggleAuthCheck } from "./kaggleApi";
import { set_loading } from "../../redux/actions/actions";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  root: {
    maxWidth: 345,
  },
}));

const KaggleDashBoard = () => {
  const classes = useStyles();
  let loading = useSelector((state) => state.kaggleReducer.loading);
  let email = useSelector((state) => state.loginReducer.email);
  const [enabled, setEnabled] = useState(false);
  const [checked, setChecked] = useState(false);

  if (!checked) {
    set_loading(true);
    KaggleAuthCheck(email).then((auth) => {
      setEnabled(auth);
      setChecked(true);
      set_loading(false);
    });
  }
  return (
    <div className="KaggleDash">
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {checked === false && (
        <Backdrop className={classes.backdrop} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {enabled === true && checked === true && (
        <div>
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
      )}

      {enabled === false && checked === true && (
        <div>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: "100vh" }}
          >
            <Grid item xs={3}>
              <Card className={classes.root}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Kaggle api key required
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      Your account does not seem have a valid Kaggle api key
                      connected. Please visit Kaggle to generate an api key and
                      add it to your account on the account page. If you
                      previously had a key associated it may no longer be valid.
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="primary">
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default KaggleDashBoard;
