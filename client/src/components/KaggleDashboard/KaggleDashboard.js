import { ButtonGroup, CardMedia, Grid } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import KaggleActionPane from "./KaggleActionPane";
import "./KaggleDashboard.css";
import KaggleDataPane from "./KaggleDataPane";
import KaggleSearchPane from "./KaggleSearchPane";
import PropTypes from "prop-types";
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
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { KaggleAuthCheck } from "./kaggleApi";
import {
  cache_competitions,
  cache_datasets,
  cache_file,
  cache_files,
  select_datafile,
  select_source,
  setKaggleSuccess,
  set_loading,
  set_userFilter,
} from "../../redux/actions/actions";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  root: {
    maxWidth: 345,
    minWidth: 275,
    minHeight: 300,
    paddingLeft: 20,
    paddingRight: 20,
  },
  success: {
    alignContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
}));

const KaggleDashBoard = (props) => {
  const classes = useStyles();
  let loading = useSelector((state) => state.kaggleReducer.loading);
  let email = useSelector((state) => state.loginReducer.email);
  let KSuccess = useSelector((state) => state.kaggleReducer.KSuccess);
  let dispatch = useDispatch();
  const [enabled, setEnabled] = useState(false);
  const [checked, setChecked] = useState(false);

  KaggleDashBoard.propTypes = {
    tab: PropTypes.number.isRequired,
    setTab: PropTypes.func.isRequired,
  };

  const checkAuth = () => {
    dispatch(set_loading(true));
    KaggleAuthCheck(email).then((auth) => {
      setEnabled(auth);
      setChecked(true);
      dispatch(set_loading(false));
      dispatch(setKaggleSuccess(false));
    });
  };

  if (!checked) {
    checkAuth();
  }

  useEffect(() => {
    return () => {
      dispatch(select_source(null));
      dispatch(select_datafile(null));
      dispatch(cache_file(null));
      dispatch(cache_files(null));
      dispatch(cache_datasets(null));
      dispatch(cache_competitions(null));
      dispatch(select_datafile(null));
      dispatch(set_loading(false));
      dispatch(setKaggleSuccess(false));
      setChecked(false);
      dispatch(
        set_userFilter({
          dataFilter: "public",
          compFilter: "general",
          searchTerm: "",
        })
      );
    };
  }, []);

  return (
    <div className="KaggleDash">
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Backdrop className={classes.backdrop} open={KSuccess}>
        <Grid
          container
          spacing={0}
          alignContent="center"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={3}>
            <Card className={classes.success}>
              <CardContent>
                <Typography
                  style={{ textAlign: "center" }}
                  variant="h5"
                  component="h5"
                >
                  Action Successful
                </Typography>
              </CardContent>
              <CardMedia>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CheckCircleOutlineIcon
                    style={{
                      color: "green",
                      fontSize: 96,
                    }}
                  />
                </div>
              </CardMedia>
              <Typography
                variant="h6"
                component="h6"
                style={{ textAlign: "center" }}
              >
                You will now be redirected to the dashboard
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Backdrop>
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
              <KaggleActionPane tab={props.tab} setTab={props.setTab} />
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
                  <ButtonGroup
                    size="small"
                    color="primary"
                    variant="contained"
                    style={{ maxWidth: "100%" }}
                  >
                    <Button
                      onClick={() => {
                        props.setTab(99);
                      }}
                    >
                      <p>Add Kaggle Credentials</p>
                    </Button>
                    <Button
                      onClick={() => {
                        try {
                          const kaggleWindow = window.open(
                            "https://www.kaggle.com/account/login?phase=startRegisterTab&returnUrl=%2F",
                            "_blank",
                            "noopener,noreferrer"
                          );
                          if (kaggleWindow) kaggleWindow.opener = null;
                        } catch (e) {
                          // TODO error
                          console.log(e);
                        }
                      }}
                    >
                      <p>Kaggle Sign Up</p>
                    </Button>
                    <Button
                      onClick={() => {
                        checkAuth();
                      }}
                    >
                      <p>Retry</p>
                    </Button>
                  </ButtonGroup>
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
