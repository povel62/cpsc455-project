import React, { useState } from "react";
import { useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import ContactMailIcon from "@material-ui/icons/ContactMail";

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

const ContactForm = () => {
  const login_token = useSelector((state) => state.loginReducer);
  const classes = useStyles();
  const [status, setStatus] = useState("Submit");
  const [values, setValues] = useState({
    message: "",
    email: login_token.email,
    name: login_token.fname + " " + login_token.lname,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const { name, email, message } = e.target.elements;

    if (values.name == "" || values.email == "" || values.message == "") {
      setOpenSnackBar(true);
      setSnackBarContent({
        content: "Please fill in all fields",
        severity: "warning",
      });
      return;
    }

    setStatus("Sending...");

    let details = {
      name: values.name,
      email: values.email,
      message: values.message,
    };

    let response = await fetch("/api/user/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + login_token.accessToken,
      },
      body: JSON.stringify(details),
    });

    setStatus("Submit");
    let result = await response.json();

    setOpenSnackBar(true);
    if (result.status == 200) {
      setSnackBarContent({
        content: result.message,
        severity: "success",
      });
    } else {
      setSnackBarContent({
        content: "Something went wrong please try again later",
        severity: "error",
      });
    }
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
              Contact Us <ContactMailIcon />
              <br />
              <br />
            </Typography>
          </div>
          <Paper style={{ padding: 22 }}>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    defaultValue={values.name}
                    onChange={(e) =>
                      setValues({ ...values, name: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="E-mail"
                    name="email"
                    autoComplete="email"
                    defaultValue={values.email}
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
                    multiline
                    rows={8}
                    id="message"
                    label="Message"
                    name="message"
                    onChange={(e) =>
                      setValues({ ...values, message: e.target.value })
                    }
                  />
                </Grid>
              </Grid>

              <br />
              <br />

              <div className="buttonContainer">
                <Button variant="contained" color="primary" type="submit">
                  {status}
                </Button>
              </div>
            </form>
          </Paper>
        </div>
      </Container>
    </>
  );
};

export default ContactForm;
