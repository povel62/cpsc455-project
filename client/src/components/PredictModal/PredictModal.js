import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { FaTimesCircle } from "react-icons/fa";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import PredictUploadButton from "./PredictUploadButton";
import { useSelector } from "react-redux";
import { CircularProgress } from "@material-ui/core";

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
    width: "1100px",
    height: "750px",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[20],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function PredictModal({
  refreshJobs,
  jobId,
  showPredict,
  setOpenSnackBar,
  setSnackBarContent,
}) {
  const login_token = useSelector((state) => state.loginReducer);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);

  const [modalText, setModalText] = useState("Test file uploaded");
  const [testData, setTestData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setSubmitting(false);
  };

  const handleClose = () => {
    setOpen(false);
    setTestData(null);
    setSubmitting(false);
    refreshJobs();
  };

  const handlePredictSubmit = async () => {
    setSubmitting(true);
    const formData = new FormData();
    if (testData == null) {
      setOpenSnackBar(true);
      setSnackBarContent({
        content: "Please upload prediction testfile",
        severity: "error",
      });
      return;
    }
    // Update the formData object
    formData.append("file", testData);
    const response = await fetch("api/job/" + jobId + "/upload", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + login_token.accessToken,
      },
      body: formData,
    });

    setSubmitting(false);
    if (response.status === 201 || response.status === 200) {
      console.log("submitted prediction testfile");
      setOpenSnackBar(true);
      setSnackBarContent({
        content: "submitted prediction testfile",
        severity: "success",
      });
      setModalText("Test file submitted for prediction");
      handleClose();
    } else {
      setOpenSnackBar(true);
      setSnackBarContent({
        content: "Something went wrong. Please try again",
        severity: "error",
      });
      setModalText("Something went wrong while submitting prediction file");
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
      <h2 id="modal-title">Submit Prediction Test file</h2>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <PredictUploadButton
          changeData={(fData) => setTestData(fData)}
          submitting={submitting}
        ></PredictUploadButton>
      </div>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        {testData && modalText}
      </div>
      <br />
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={handlePredictSubmit}
        disabled={submitting}
        style={{ float: "right" }}
      >
        Submit {submitting && <CircularProgress size={25} />}
      </Button>
    </div>
  );

  return (
    <div>
      {showPredict && (
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
      )}
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
