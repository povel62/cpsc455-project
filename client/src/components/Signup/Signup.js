import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Slide from "@material-ui/core/Slide";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { signupUser } from "../../api/UserService";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";

import SkyBackground from "../SkyBackground";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/povel62/cpsc455-project">
        Byte Mechanics
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
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
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Signup(props) {
  const classes = useStyles();
  const [values, setValues] = useState({
    email: "",
    guest: false,
    password: "",
    confirmPassword: "",
    fname: "",
    lname: "",
    kaggleUsername: "",
    kapi: "",
  });
  const [open, setOpen] = React.useState(false);
  const [snackBarContent, setSnackBarContent] = React.useState({
    content: "Sign Up was successful!",
    severity: "success",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (values.fname === "" || values.lname === "") {
      setOpen(true);
      setSnackBarContent({
        content: "Name fields can't be empty",
        severity: "warning",
      });
      return;
    }

    if (values.email === "") {
      setOpen(true);
      setSnackBarContent({
        content: "Email field can't be empty",
        severity: "warning",
      });
      return;
    }
    if (values.password === "" || values.confirmPassword === "") {
      setOpen(true);
      setSnackBarContent({
        content: "Password fields cannot be empty",
        severity: "warning",
      });
      return;
    }
    if (values.password !== values.confirmPassword) {
      setOpen(true);
      setSnackBarContent({
        content: "Passwords don't match",
        severity: "warning",
      });
      return;
    }
    const body = await signupUser(
      values.kaggleUsername &&
        values.kaggleUsername != "" &&
        values.kaggleApiKey &&
        values.kaggleApiKey != ""
        ? {
            guest: values.guest,
            fname: values.fname,
            lname: values.lname,
            email: values.email,
            password: values.password,
            kusername: values.kaggleUsername,
            kapi: values.kaggleApiKey,
          }
        : {
            guest: values.guest,
            fname: values.fname,
            lname: values.lname,
            email: values.email,
            password: values.password,
          }
    );
    if (body.success) {
      setOpen(true);
      setSnackBarContent({
        content: "Sign Up was successful!",
        severity: "success",
      });
      if (props.callback) props.callback(true);
    } else {
      setOpen(true);
      setSnackBarContent({ content: body.error, severity: "error" });
    }
  };

  return (
    <>
      <SkyBackground />

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackBarContent.severity}>
          {snackBarContent.content}
        </Alert>
      </Snackbar>
      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Container component="main" maxWidth="xs">
          <CssBaseline />

          <div className={classes.paper}>
            <img width="100" height="100" src="../logo.png" />

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
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
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
                      label="First Name"
                      autoFocus
                      onChange={(e) =>
                        setValues({ ...values, fname: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="lname"
                      onChange={(e) =>
                        setValues({ ...values, lname: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      onChange={(e) =>
                        setValues({ ...values, email: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="password"
                      onChange={(e) =>
                        setValues({ ...values, password: e.target.value })
                      }
                    />
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="confirm-password"
                      label="Confirm Password"
                      type="password"
                      id="confirm-password"
                      autoComplete="confirm password"
                      onChange={(e) =>
                        setValues({
                          ...values,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="kaggleUsername"
                      label="Kaggle Username (optional)"
                      name="kaggleUsername"
                      autoComplete="kaggleUsername"
                      onChange={(e) =>
                        setValues({
                          ...values,
                          kaggleUsername: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="kaggleApiKey"
                      name="kaggleApiKey"
                      variant="outlined"
                      fullWidth
                      id="kaggleApiKey"
                      label="Kaggle Api Key (optional)"
                      onChange={(e) =>
                        setValues({
                          ...values,
                          kaggleApiKey: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Link
                      onClick={() => {
                        if (props.callback) {
                          props.callback(false);
                        }
                      }}
                      variant="body2"
                    >
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </div>
          <Box mt={5}>
            <Copyright />
          </Box>
        </Container>
      </Slide>
    </>
  );
}

Signup.propTypes = {
  callback: PropTypes.func,
};
