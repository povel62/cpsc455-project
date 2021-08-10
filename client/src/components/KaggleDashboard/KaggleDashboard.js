import {
  ButtonGroup,
  CardMedia,
  Grid,
  Backdrop,
  CircularProgress,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import KaggleActionPane from "./KaggleActionPane";
import "./KaggleDashboard.css";
import KaggleDataPane from "./KaggleDataPane";
import KaggleSearchPane from "./KaggleSearchPane";
import PropTypes from "prop-types";
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
  setSourceAdditionalInfo,
} from "../../redux/actions/actions";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

// tour stuff
import ReactJoyride, { EVENTS } from "react-joyride";
import steps from "./kaggleTourSteps";

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
  let token = useSelector((state) => state.loginReducer.accessToken);
  let KSuccess = useSelector((state) => state.kaggleReducer.KSuccess);
  let isPremium = useSelector((state) => state.loginReducer.premium);
  let dispatch = useDispatch();
  const [enabled, setEnabled] = useState(false);
  const [checked, setChecked] = useState(false);

  KaggleDashBoard.propTypes = {
    joyride: PropTypes.shape({
      callback: PropTypes.func,
    }),
    tab: PropTypes.number.isRequired,
    setTab: PropTypes.func.isRequired,
  };

  KaggleDashBoard.defaultProps = {
    joyride: {},
  };
  const [run, setRun] = useState(false);

  const handleClickStart = (e) => {
    e.preventDefault();
    setRun(true);
  };

  const handleJoyrideCallback = (data) => {
    const { joyride } = props;
    const { type } = data;

    if (type === EVENTS.TOUR_END && run) {
      setRun(false);
    }

    if (type === EVENTS.TARGET_NOT_FOUND && run) {
      setRun(false);
    }

    if (typeof joyride.callback === "function") {
      joyride.callback(data);
    } else {
      console.group(type);
      console.log(data); //eslint-disable-line no-console
      console.groupEnd();
    }
  };

  const checkAuth = () => {
    dispatch(set_loading(true));
    KaggleAuthCheck(token).then((auth) => {
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
      dispatch(setSourceAdditionalInfo(null));
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
      <ReactJoyride
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
        run={run}
        steps={steps}
        styles={{
          options: {
            arrowColor: "#e3ffeb",
            // primaryColor: "#2196f3",
            zIndex: 1000,
          },
        }}
        callback={handleJoyrideCallback}
      />

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
          style={{
            margin: 0,
            width: "100%",
          }}
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
              <CardActions>
                <ButtonGroup
                  size="small"
                  color="primary"
                  aria-label="small contained button group"
                  fullWidth={true}
                  variant="contained"
                >
                  <Button
                    onClick={() => {
                      dispatch(setKaggleSuccess(false));
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      props.setTab(0);
                      dispatch(setKaggleSuccess(false));
                    }}
                  >
                    Job Dashboard
                  </Button>
                </ButtonGroup>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Backdrop>
      {enabled === true && checked === true && (
        <div>
          <Button onClick={handleClickStart} color="primary" variant="outlined">
            Take a tour of Kaggle dashboard
          </Button>

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
                    <Typography variant="h5" component="h2">
                      {isPremium
                        ? "Kaggle api key required"
                        : "Premium Feature"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {isPremium
                        ? "Your account does not seem have a valid Kaggle api key connected. Please visit Kaggle to generate an api key and add it to your account on the account page. If you previously had a key associated it may no longer be valid"
                        : "The feature you are trying to access is only available to a Premium user. To access this feature, upgrade to Premium with a one-time fee of 10$. Become Premium and enjoy all the perks of kaggle in AutoML"}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  {isPremium && (
                    <ButtonGroup
                      size="small"
                      color="primary"
                      variant="contained"
                      style={{ maxWidth: "100%", height: "6rem" }}
                    >
                      <Button
                        style={{
                          width: `${(1 / 3) * 100}%`,
                          maxHeight: "100%",
                          fontSize: "0.7rem",
                        }}
                        onClick={() => {
                          props.setTab(99);
                        }}
                      >
                        Add Kaggle Credentials
                      </Button>
                      <Button
                        style={{
                          width: `${(1 / 3) * 100}%`,
                          maxHeight: "100%",
                          fontSize: "0.7rem",
                        }}
                        onClick={() => {
                          try {
                            const kaggleWindow = window.open(
                              "https://www.kaggle.com/account/login?phase=startRegisterTab&returnUrl=%2F",
                              "_blank",
                              "noopener,noreferrer"
                            );
                            if (kaggleWindow) kaggleWindow.opener = null;
                          } catch (e) {
                            console.log(e);
                          }
                        }}
                      >
                        <p>Kaggle Sign Up</p>
                      </Button>
                      <Button
                        style={{
                          width: `${(1 / 3) * 100}%`,
                          maxHeight: "100%",
                          fontSize: "1rem",
                        }}
                        onClick={() => {
                          checkAuth();
                        }}
                      >
                        <p>Retry</p>
                      </Button>
                    </ButtonGroup>
                  )}
                  {!isPremium && (
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      style={{
                        width: "100%",
                        height: "4rem",
                        fontSize: "1rem",
                      }}
                      onClick={() => {
                        props.setTab(99);
                      }}
                    >
                      To My Account
                    </Button>
                  )}
                </CardActions>
                <br />
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default KaggleDashBoard;
