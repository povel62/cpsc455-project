import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Slide from "@material-ui/core/Slide";
import { useHistory } from "react-router-dom";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Switch from "@material-ui/core/Switch";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { signupUser } from "../../api/UserService";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
// function TransitionLeft(props) {
//   return <Slide {...props} direction="left" />;
// }

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
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

export default function Signup() {
  let history = useHistory();
  const classes = useStyles();
  const [values, setValues] = useState({
    email: "",
    isGuest: false,
    password: "",
    fname: "",
    lname: "",
    dob: "08/18/2014",
    isKaggleUser: false,
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
    const body = await signupUser(
      values.isKaggleUser
        ? {
            guest: values.guest,
            fname: values.fname,
            lname: values.lname,
            email: values.email,
            password: values.password,
            dob: values.dob,
            kusername: values.kaggleUsername,
            kapi: values.kaggleApiKey,
          }
        : {
            guest: values.guest,
            fname: values.fname,
            lname: values.lname,
            email: values.email,
            password: values.password,
            dob: values.dob,
          }
    );
    if (body.success) {
      setOpen(true);
      setSnackBarContent({
        content: "Sign Up was successful!",
        severity: "success",
      });
      history.push({
        pathname: "/",
        signUpSuccessful: true,
      });
    } else {
      setOpen(true);
      setSnackBarContent({ content: body.error, severity: "error" });
    }
  };

  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackBarContent.severity}>
          {snackBarContent.content}
        </Alert>
      </Snackbar>
      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <h1 className="glitched neonText">AutoML</h1>

          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
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
                    autoComplete="current-password"
                    onChange={(e) =>
                      setValues({ ...values, password: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Date of birth"
                      value={values.dob}
                      onChange={(e) =>
                        setValues({ ...values, dob: e.target.value })
                      }
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.isKaggleUser}
                        onChange={(event) =>
                          setValues({
                            ...values,
                            [event.target.name]: event.target.checked,
                          })
                        }
                        name="isKaggleUser"
                        color="primary"
                      />
                    }
                    label="Enable Kaggle Integration"
                  />
                </Grid>
                {values.isKaggleUser && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="kaggleUsername"
                        label="Kaggle Username"
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
                        required
                        fullWidth
                        id="kaggleApiKey"
                        label="Kaggle Api Key"
                        autoFocus
                        onChange={(e) =>
                          setValues({ ...values, kaggleApiKey: e.target.value })
                        }
                      />
                    </Grid>
                  </>
                )}
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
                  <Link href="/" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={5}>
            <Copyright />
          </Box>
        </Container>
      </Slide>
    </>
  );
}
