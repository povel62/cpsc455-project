import React, { useState } from "react";
import "./AccountDashboard.css";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { setEmail } from "../../redux/actions/actions";
// import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import FilledInput from "@material-ui/core/FilledInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     "& > *": {
//       margin: theme.spacing(1),
//       width: "25ch",
//     },
//     submit: {
//       margin: theme.spacing(3, 0, 2),
//     },
//   },
// }));

const AccountDashboard = () => {
  // const classes = useStyles();
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
    fname: "",
    lname: "",
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

    alert(response.status);
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
    <div className="accountDashboard">
      <br />
      <br />
      <div className="innerAccountDashboard">
        {editInfo ? (
          <div>
            <TextField
              id="standard-basic"
              label="First Name"
              defaultValue={values.fname}
              onChange={(e) => setValues({ ...values, fname: e.target.value })}
            />
            <br />
          </div>
        ) : (
          <p>
            <strong>First Name:</strong> {values.fname}
          </p>
        )}

        {editInfo ? (
          <div>
            <TextField
              id="standard-basic"
              label="Last Name"
              defaultValue={values.lname}
              onChange={(e) => setValues({ ...values, lname: e.target.value })}
            />
            <br />
            <br />
          </div>
        ) : (
          <p>
            <strong>Last Name:</strong> {values.lname}
          </p>
        )}

        {editInfo ? (
          <div>
            <TextField
              id="standard-basic"
              label="Email"
              defaultValue={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
            <br />
            <br />
          </div>
        ) : (
          <p>
            <strong>Email:</strong> {values.email}
          </p>
        )}
        {editInfo ? (
          <div>
            <InputLabel htmlFor="filled-adornment-password">
              Password
            </InputLabel>
            <FilledInput
              label="Password"
              id="standard-adornment-password"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={(e) => setValues({ ...values, pwd: e.target.value })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <br />
            <br />
          </div>
        ) : (
          <p>
            <strong>Password:</strong>*********
          </p>
        )}
        {editInfo ? (
          <div>
            <TextField
              id="standard-basic"
              label="Kaggle username"
              defaultValue={values.kusername}
              onChange={(e) =>
                setValues({ ...values, kusername: e.target.value })
              }
            />
            <br />
            <br />
          </div>
        ) : (
          <p>
            <strong>kaggle username: </strong>
            {values.kusername}
          </p>
        )}
        {editInfo ? (
          <div>
            <TextField
              id="standard-basic"
              label="Kaggle API"
              defaultValue={values.kapi}
              onChange={(e) => setValues({ ...values, kapi: e.target.value })}
            />
            <br />
            <br />
          </div>
        ) : (
          <p>
            <strong>kaggle Api: </strong>
            {values.kapi}
          </p>
        )}
        <br />
        <br />
        {editInfo ? (
          <div className="buttonContainer">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={submitEditInfo}
            >
              Submit
            </Button>

            <Button
              type="submit"
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
              type="submit"
              variant="contained"
              color="primary"
              onClick={toggleEditInfo}
            >
              Edit
            </Button>
          </div>
        )}
        <br />
      </div>
    </div>
  );
};

export default AccountDashboard;
