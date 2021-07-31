import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { FaTimesCircle } from "react-icons/fa";
import Tooltip from "@material-ui/core/Tooltip";
import { Button, TextField } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useSelector } from "react-redux";

function getModalStyle() {
  const top = 5;

  return {
    top: `${top}%`,
    margin: "auto",
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "70vw",
    height: "70vh",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function ShareModal({ jobID }) {
  const [values, setValues] = useState({
    response: "",
    post: "",
    responseToPost: "",
    user: "",
  });

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);

  const login_token = useSelector((state) => state.loginReducer);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(values.user);
    const response = await fetch("api/job/addUsers/" + jobID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + login_token.accessToken,
      },
      body: JSON.stringify({ users: values.user }),
    });

    if (response.status === 201 || response.status === 200) {
      console.log(response);
      alert(response.status);
    } else {
      alert("Something went wrong");
    }
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Tooltip title="close window" aria-label="close window">
        <FaTimesCircle
          size="1.5em"
          onClick={handleClose}
          style={{ cursor: "pointer" }}
        />
      </Tooltip>
      <h2 id="modal-title">Share job with another user</h2>
      <p id="modal-description">Please enter the email of the user</p>
      <TextField
        autoComplete="user"
        name="user"
        variant="outlined"
        required
        fullWidth
        id="User_email"
        label="User Email"
        autoFocus
        onChange={(e) => setValues({ ...values, user: e.target.value })}
      />
      <br />
      <br />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={handleSubmit}
      >
        Add user
      </Button>
    </div>
  );

  return (
    <div>
      <Tooltip title="Add a user" aria-label="add a user">
        <Button
          variant="contained"
          color="primary"
          component="span"
          onClick={handleOpen}
          endIcon={<AddIcon />}
        >
          Share
        </Button>
      </Tooltip>
      <Modal
        open={open}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {body}
      </Modal>
    </div>
  );
}
