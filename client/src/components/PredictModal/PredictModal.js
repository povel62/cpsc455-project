import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { FaTimesCircle } from "react-icons/fa";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import PredictUploadButton from "./PredictUploadButton";
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

export default function PredictModal({ refreshJobs, jobId }) {
  const login_token = useSelector((state) => state.loginReducer);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [testData, setTestData] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    refreshJobs();
  };

  const handlePredictSubmit = async () => {
    console.log(testData);
    console.log(jobId);
    const formData = new FormData();

    // Update the formData object
    formData.append("file", testData);

    const response = await fetch("api/job/" + jobId + "/upload", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + login_token.accessToken,
      },
      body: formData,
    });

    if (response.status === 201 || response.status === 200) {
      console.log("submitted prediction testfile");
    } else {
      alert("Something went wrong while submitting prediction file");
    }
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
      <h2 id="modal-title">Submit Prediction file</h2>
      <PredictUploadButton
        changeData={(fData) => setTestData(fData)}
      ></PredictUploadButton>
      <br />
      {testData && "Test file uploaded"}
      <br />
      <br />
      {testData && (
        <Button
          variant="contained"
          color="primary"
          onClick={handlePredictSubmit}
        >
          Submit
        </Button>
      )}
    </div>
  );

  return (
    <div>
      <Tooltip
        title="Submit testfile"
        aria-label="Submit test file for prediction"
      >
        <Button
          variant="contained"
          component="span"
          onClick={handleOpen}
          endIcon={<DonutLargeIcon />}
        >
          Predict
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
