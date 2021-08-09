import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { FaTimesCircle } from "react-icons/fa";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { useSelector } from "react-redux";
import axios from "axios";
import { Select, MenuItem, CircularProgress } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function getModalStyle() {
  const top = 15;

  return {
    top: `${top}%`,
    margin: "auto",
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "500px",
    height: "300px",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function PredictDlModal({ refreshJobs, jobId, showDownload }) {
  const login_token = useSelector((state) => state.loginReducer);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [preds, setPreds] = useState([]);
  const [pred, setPred] = useState("");

  const [load, setLoad] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleOpen = () => {
    setLoad(true);
    setOpen(true);
    handleFileNames();
  };

  const handleClose = () => {
    setOpen(false);
    setSubmitting(false);
    setLoad(false);
    refreshJobs();
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
    await getFileNames(jobId)
      .then((res) => {
        setLoad(false);
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
        setPreds(entries);
      })
      .catch(() => {
        console.log("fail");
        setPreds([]);
      });
  };

  const handleDlPredict = async () => {
    if (preds && preds.length >= 1) {
      setSubmitting(true);
      let fileName = pred;
      axios
        .get("/api/job/" + jobId + "/pred/" + fileName, {
          headers: {
            Authorization: "Bearer " + login_token.accessToken,
          },
        })
        .then((res) => {
          setSubmitting(false);
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
            setOpenSnackBar(true);
            setSnackBarContent({
              content: "Downloading file...",
              severity: "info",
            });
          } else {
            setOpenSnackBar(true);
            setSnackBarContent({
              content: "Something went wrong. Please try again",
              severity: "error",
            });
          }
        })
        .catch(() => {
          setOpenSnackBar(true);
          setSnackBarContent({
            content: "Something went wrong. Please try again",
            severity: "error",
          });
        });
    } else {
      console.log("file list empty");
    }
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      {!submitting && (
        <Tooltip title="close window" aria-label="close window">
          <FaTimesCircle
            size="1.5em"
            onClick={handleClose}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      )}
      {submitting && <p> Cannot close while download request is being made</p>}
      <h2 id="modal-title">Download Prediction File</h2>
      <br />
      {!load && (
        <Select
          required
          disabled={submitting || load}
          defaultValue={() => {
            if (preds && preds.length >= 1) {
              setPred(preds[0].props.value);
              return preds[0].props.value;
            }
          }}
          onChange={(e) => {
            if (e.target.value) {
              setPred(e.target.value);
            }
          }}
        >
          {preds}
        </Select>
      )}
      {load && <CircularProgress size={44} />}
      <br />
      <br />
      {submitting && <CircularProgress size={44} />}
      {!submitting && (
        <Tooltip
          title="Download prediction file"
          aria-label="Download prediction file"
        >
          <Button
            variant="contained"
            component="span"
            disabled={preds.length <= 1}
            onClick={handleDlPredict}
            endIcon={<CloudDownloadIcon />}
          >
            Download Prediction File
          </Button>
        </Tooltip>
      )}
    </div>
  );

  return (
    <div>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={3000}
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
      {showDownload && (
        <div>
          <Tooltip
            title="Download prediction file"
            aria-label="Download prediction file"
          >
            <Button
              variant="contained"
              component="span"
              onClick={handleOpen}
              endIcon={<CloudDownloadIcon />}
            >
              Download Prediction
            </Button>
          </Tooltip>
          <br />
          <br />
        </div>
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
