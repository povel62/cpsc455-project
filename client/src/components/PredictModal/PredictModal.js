import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { FaTimesCircle } from "react-icons/fa";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import PredictUploadButton from "./PredictUploadButton";
import { useSelector } from "react-redux";
import axios from "axios";
import { MenuItem } from "@material-ui/core";

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
    width: "60vw",
    height: "50vh",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function PredictModal({
  refreshJobs,
  jobId,
  showPredict,
  showDownload,
}) {
  const login_token = useSelector((state) => state.loginReducer);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);

  const [modalText, setModalText] = useState("Test file uploaded");
  const [testData, setTestData] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTestData(null);
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
      setModalText("Test file submitted for prediction");
    } else {
      setModalText("Something went wrong while submitting prediction file");
    }
  };

  const getFileNames = (job) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/job/${job}/preds`, {
          headers: {
            Authorization: "Bearer " + login_token.accessToken,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            resolve(res.data.fileNames);
          } else {
            resolve([]);
          }
        })
        .catch(() => reject([]));
    });
  };

  const handleFileNames = async () => {
    let fileList = [];
    await getFileNames(jobId)
      .then((res) => {
        let entries = res.map((ele, i) => {
          let name;
          try {
            name = ele.slice(26, -4);
          } catch {
            name = ele;
          }
          return (
            <MenuItem value={ele} key={i}>
              {name}
            </MenuItem>
          );
        });
        console.log("success");
        console.log(entries);
        fileList = entries;
      })
      .catch(() => {
        console.log("fail");
        fileList = [];
      });
    return fileList;
  };

  const handleDlPredict = async () => {
    let fileList = await handleFileNames();

    console.log(fileList);
    if (fileList && fileList.length >= 1) {
      let fileName = fileList[0].props.value;
      axios
        .get("/api/job/" + jobId + "/pred/" + fileName, {
          headers: {
            Authorization: "Bearer " + login_token.accessToken,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            let name = fileName;
            const addr = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = addr;
            link.setAttribute("download", name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(addr);
          } else {
            setModalText("Download failed");
          }
        })
        .catch(() => {
          setModalText("Download failed");
        });
    } else {
      console.log("file list empty");
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
      <PredictUploadButton
        changeData={(fData) => setTestData(fData)}
      ></PredictUploadButton>
      <br />
      <br />
      {testData && modalText}
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
      {showDownload && (
        <Tooltip
          title="Download prediction file"
          aria-label="Download prediction file"
        >
          <Button
            variant="contained"
            component="span"
            onClick={handleDlPredict}
            endIcon={<CloudDownloadIcon />}
          >
            Prediction
          </Button>
        </Tooltip>
      )}
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
