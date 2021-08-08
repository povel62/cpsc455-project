import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import AddStepper from "./AddStepper";
import { FaTimesCircle } from "react-icons/fa";
import Tooltip from "@material-ui/core/Tooltip";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { Button } from "@material-ui/core";

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
    overflowY: "scroll",
    overflowX: "scroll",
    width: "80vw",
    height: "90vh",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function JobModal({ refreshJobs, setTab }) {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    refreshJobs();
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
      <h2 id="modal-title">Add ML Job</h2>
      <AddStepper setTab={setTab} />
    </div>
  );

  return (
    <div>
      <Tooltip title="Add a job" aria-label="add a job">
        <Button
          variant="contained"
          color="primary"
          aria-label="add a new job"
          component="span"
          onClick={handleOpen}
          endIcon={<AddBoxIcon />}
        >
          Add Job
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
