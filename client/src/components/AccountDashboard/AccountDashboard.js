import React, { useState } from "react";
import "./AccountDashboard.css";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { setEmail } from "../../redux/actions/actions";
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
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function AccountDashboard() {
  const classes = useStyles();
  const login_token = useSelector((state) => state.loginReducer);

  const dispatch = useDispatch();
  const [values, setValues] = useState({
    response: "",
    post: "",
    responseToPost: "",
    email: login_token.email,
    guest: false,
    pwd: "",
    kusername: "test K user",
    kapi: "test k api",
    showPassword: false,
    fname: login_token.fname,
    lname: login_token.lname,
  });

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
      body: JSON.stringify({ email: values.email }),
    });

    if (response.status === 200) {
      dispatch(setEmail(values.email));
    }
  };
  const closeEditInfo = () => {
    setEditInfo(!editInfo);
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <br />
      <br />
      <br />
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
              Account Info
            </Typography>
          </div>
          <Paper style={{ padding: 22 }}>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {editInfo ? (
                    <div>
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
                      />
                    </div>
                  ) : (
                    <p>
                      <strong>First Name:</strong> {values.fname}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {editInfo ? (
                    <div>
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
                      />
                    </div>
                  ) : (
                    <p>
                      <strong>Last Name:</strong> {values.lname}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {editInfo ? (
                    <div>
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
                      />
                    </div>
                  ) : (
                    <p>
                      <strong>Email:</strong> {values.email}
                    </p>
                  )}
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
                              {values.showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </div>
                  ) : (
                    <p>
                      <strong>Password:</strong>*********
                    </p>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  {editInfo ? (
                    <div>
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
                      />
                    </div>
                  ) : (
                    <p>
                      <strong>kaggle username: </strong>
                      {values.kusername}
                    </p>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  {editInfo ? (
                    <div>
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
                      />
                    </div>
                  ) : (
                    <p>
                      <strong>kaggle Api: </strong>
                      {values.kapi}
                    </p>
                  )}
                </Grid>
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
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={toggleEditInfo}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </form>
          </Paper>
        </div>
        <Box mt={5}></Box>
      </Container>
    </>
  );
}
