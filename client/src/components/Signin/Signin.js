import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Slide from "@material-ui/core/Slide";
import { useDispatch } from "react-redux";
import {
  setLoginToken,
  setEmail,
  setFName,
  setLName,
  setPremium,
  setGuest,
} from "../../redux/actions/actions";
import { useHistory } from "react-router-dom";
import Switch from "@material-ui/core/Switch";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { loginUser, signupUser } from "../../api/UserService";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";

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
    marginTop: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(1),
    backgroundColor: "#88B7B5",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Signin(props) {
  const [isGuest, setIsGuest] = React.useState(false);

  const dispatch = useDispatch();
  let history = useHistory();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [open, setOpen] = React.useState(props.signUpSuccessful);
  const [snackBarContent, setSnackBarContent] = React.useState({
    content: "Sign Up was successful! Now you can sign in..",
    severity: "success",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleLogin = async (e) => {
    let userNewlyRegistred = false;
    e.preventDefault();

    if (values.email === "") {
      setOpen(true);
      setSnackBarContent({
        content: "Email field can't be empty",
        severity: "warning",
      });
      return;
    }

    if (!isGuest && values.password === "") {
      setSnackBarContent({
        content: "Password cannot be empty for a regular user.",
        severity: "error",
      });
      setOpen(true);
      return;
    }
    let body = await loginUser(
      isGuest
        ? { email: values.email }
        : { email: values.email, password: values.password }
    );
    if (body.error && body.error === "User not found" && isGuest) {
      body = await signupUser({ email: values.email });

      if (body.success) {
        userNewlyRegistred = true;
        body = await loginUser({ email: values.email });
      } else {
        setOpen(true);
        setSnackBarContent({ content: body.error, severity: "error" });
      }
    } else if (body.error) {
      setOpen(true);
      setSnackBarContent({ content: body.error, severity: "error" });
    }
    if (body.accessToken) {
      dispatch(setLoginToken(body.accessToken));
      dispatch(setEmail(body.data.email));
      dispatch(setFName(body.data.fname));
      dispatch(setLName(body.data.lname));
      dispatch(setGuest(body.data.guest));
      dispatch(setPremium(body.data.premium));
      history.push({
        pathname: "/home",
        state: { isUserNewlyRegistred: userNewlyRegistred },
        // state: { },
      });
    }
  };
  const classes = useStyles();

  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackBarContent.severity}>
          {snackBarContent.content}
        </Alert>
      </Snackbar>
      <Slide direction="left" in={true}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <img width="100" height="100" src="../logo.png" />

            <div
              style={{
                width: "100%",
                borderRadius: ".25rem",
                background:
                  // "linear-gradient(120deg , #e0c3fc 0%, #8ec5fc 100%)",
                  "linear-gradient(40deg ,#45cafc,#303f9f)",
                // "linear-gradient(to right bottom, #430089, #82ffa1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in {isGuest ? `as Guest` : ``}
              </Typography>
            </div>
            <Paper style={{ padding: 22 }}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isGuest}
                      onChange={(event) => {
                        setIsGuest(event.target.checked);
                      }}
                      name="isGuest"
                      color="primary"
                    />
                  }
                  label="Go Incognito?"
                />
              </Grid>
              <form className={classes.form} noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={(e) =>
                    setValues({ ...values, email: e.target.value })
                  }
                />
                {!isGuest && (
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={(e) =>
                      setValues({ ...values, password: e.target.value })
                    }
                  />
                )}
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      onClick={() => {
                        if (props.callback) {
                          props.callback();
                        }
                      }}
                      variant="body2"
                    >
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </div>
          <br />

          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      </Slide>
    </>
  );
}

Signin.propTypes = {
  callback: PropTypes.func,
  signUpSuccessful: PropTypes.bool,
};
