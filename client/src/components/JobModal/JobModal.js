import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import AddStepper from "./AddStepper";
import { FaTimesCircle } from "react-icons/fa";
import Tooltip from "@material-ui/core/Tooltip";
import AddBoxIcon from "@material-ui/icons/AddBox";
import IconButton from "@material-ui/core/IconButton";
//import { DropzoneArea } from "material-ui-dropzone";

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

export default function JobModal({ refreshJobs }) {
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
      <Tooltip title="close" aria-label="close">
        <FaTimesCircle
          size="1.5em"
          title="close"
          onClick={handleClose}
          style={{ cursor: "pointer" }}
        />
      </Tooltip>
      <h2 id="modal-title">Add ML Job</h2>
      <p id="modal-description">Add job by following the steps</p>
      <AddStepper />
    </div>
  );

  return (
    <div>
      <Tooltip title="Add a job" aria-label="add a job">
        <IconButton
          color="primary"
          aria-label="add a new job"
          onClick={handleOpen}
          size="large"
        >
          <AddBoxIcon />
        </IconButton>
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
