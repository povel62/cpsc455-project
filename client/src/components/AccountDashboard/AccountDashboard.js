import React, { useState } from "react";
import "./AccountDashboard.css";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import {
  setEmail,
  setFName,
  setLName,
  setKaggleAPI,
  setKaggleUsername,
} from "../../redux/actions/actions";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import FilledInput from "@material-ui/core/FilledInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import PaymentModal from "../PaymentGateway/PaymentModal";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function AccountDashboard() {
  const classes = useStyles();
  const login_token = useSelector((state) => state.loginReducer);
  const isPremium = login_token.premium;

  const dispatch = useDispatch();
  const [values, setValues] = useState({
    response: "",
    post: "",
    responseToPost: "",
    email: login_token.email,
    guest: login_token.guest,
    pwd: "",
    kusername: login_token.kusername,
    kapi: login_token.kapi,
    showPassword: false,
    fname: login_token.fname,
    lname: login_token.lname,
  });

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarContent, setSnackBarContent] = useState({
    content: " ",
    severity: "success",
  });

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const [editInfo, setEditInfo] = useState(false);

  const toggleEditInfo = () => setEditInfo(!editInfo);

  const submitEditInfo = async (e) => {
    e.preventDefault();
    setEditInfo(!editInfo);

    const response = await fetch("/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + login_token.accessToken,
      },
      body: JSON.stringify({
        email: values.email,
        fname: values.fname,
        lname: values.lname,
        kusername: values.kusername,
        kapi: values.kapi,
      }),
    });

    setOpenSnackBar(true);
    if (response.status === 200) {
      dispatch(setEmail(values.email));
      dispatch(setFName(values.fname));
      dispatch(setLName(values.lname));
      dispatch(setKaggleUsername(values.kusername));
      dispatch(setKaggleAPI(values.kapi));
      setSnackBarContent({
        content: "account changes made successfully",
        severity: "success",
      });
    } else {
      resetValues();
      setSnackBarContent({
        content: "Something went wrong please try again later",
        severity: "error",
      });
    }
  };

  const resetValues = () => {
    setValues({
      ...values,
      email: login_token.email,
      kusername: login_token.kusername,
      kapi: login_token.kapi,
      fname: login_token.fname,
      lname: login_token.lname,
    });

    document.getElementById("firstName").value = login_token.fname;
    document.getElementById("lastName").value = login_token.lname;
    document.getElementById("email").value = login_token.email;
    document.getElementById("kaggleUsername").value = login_token.kusername;
    document.getElementById("kaggleApiKey").value = login_token.kapi;
  };

  const closeEditInfo = (e) => {
    e.preventDefault();
    setEditInfo(!editInfo);
    resetValues();
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <br />
      <br />
      <br />
      <Snackbar
        open={openSnackBar}
        autoHideDuration={1500}
        onClose={handleCloseSnackBar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={snackBarContent.severity}
        >
          {snackBarContent.content}
        </Alert>
      </Snackbar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <div>
          <div
            style={{
              width: "100%",
              borderRadius: ".25rem",
              background: "linear-gradient(40deg ,#45cafc,#303f9f)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              <br />
              Account Info <AccountCircle />
              <br />
              <br />
            </Typography>
          </div>
          <Paper style={{ padding: 22 }}>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    defaultValue={values.fname}
                    label="First Name"
                    autoFocus
                    onChange={(e) =>
                      setValues({ ...values, fname: e.target.value })
                    }
                    InputProps={{
                      readOnly: editInfo ? false : true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    defaultValue={values.lname}
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    onChange={(e) =>
                      setValues({ ...values, lname: e.target.value })
                    }
                    InputProps={{
                      readOnly: editInfo ? false : true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    defaultValue={values.email}
                    name="email"
                    autoComplete="email"
                    onChange={(e) =>
                      setValues({ ...values, email: e.target.value })
                    }
                    InputProps={{
                      readOnly: editInfo ? false : true,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  {editInfo ? (
                    <div>
                      <InputLabel htmlFor="filled-adornment-password">
                        Password
                      </InputLabel>
                      <FilledInput
                        variant="outlined"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        autoComplete="password"
                        id="standard-adornment-password"
                        type={values.showPassword ? "text" : "password"}
                        value={values.password}
                        onChange={(e) =>
                          setValues({ ...values, pwd: e.target.value })
                        }
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {values.showPassword && <Visibility />}
                              {!values.showPassword && <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </div>
                  ) : (
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="pwd"
                      label="Password"
                      defaultValue="***********"
                      name="Password"
                      onChange={(e) =>
                        setValues({ ...values, pwd: e.target.value })
                      }
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  )}
                </Grid>
                {isPremium && (
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="kaggleUsername"
                      label="Kaggle Username (optional)"
                      name="kaggleUsername"
                      autoComplete="kaggleUsername"
                      defaultValue={values.kusername}
                      onChange={(e) =>
                        setValues({ ...values, kusername: e.target.value })
                      }
                      InputProps={{
                        readOnly: editInfo ? false : true,
                      }}
                    />
                  </Grid>
                )}
                {isPremium && (
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="kaggleApiKey"
                      name="kaggleApiKey"
                      variant="outlined"
                      fullWidth
                      id="kaggleApiKey"
                      label="Kaggle Api Key "
                      defaultValue={values.kapi}
                      onChange={(e) =>
                        setValues({ ...values, kapi: e.target.value })
                      }
                      InputProps={{
                        readOnly: editInfo ? false : true,
                      }}
                    />
                  </Grid>
                )}
              </Grid>

              <br />
              <br />

              {editInfo ? (
                <div className="buttonContainer">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={submitEditInfo}
                  >
                    Submit
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={closeEditInfo}
                  >
                    Close
                  </Button>
                </div>
              ) : (
                <div className="buttonContainer">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={toggleEditInfo}
                  >
                    Edit
                  </Button>
                  <br />
                  {!isPremium && (
                    <PaymentModal
                      setOpenSnackBar={setOpenSnackBar}
                      setSnackBarContent={setSnackBarContent}
                    />
                  )}
                </div>
              )}
            </form>
            <br />
            <br />
          </Paper>
        </div>
        <Box mt={5}></Box>
      </Container>
    </>
  );
}
