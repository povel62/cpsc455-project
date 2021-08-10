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
    height: "350px",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[20],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function PredictDlModal({
  refreshJobs,
  jobId,
  showDownload,
  setOpenSnackBar,
  setSnackBarContent,
}) {
  const login_token = useSelector((state) => state.loginReducer);
  const isPremium = login_token.premium;
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [preds, setPreds] = useState([]);
  const [pred, setPred] = useState("");

  const [load, setLoad] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleOpen = () => {
    setLoad(true);
    setSubmitting(false);
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
            const addr = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = addr;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(addr);
            setOpenSnackBar(true);
            setSnackBarContent({
              content: "Downloading..." + fileName,
              severity: "info",
            });
            handleClose();
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
      <Tooltip title="close window" aria-label="close window">
        <FaTimesCircle
          size="1.5em"
          onClick={handleClose}
          style={{ cursor: "pointer" }}
        />
      </Tooltip>
      <h2 id="modal-title">Download Prediction File</h2>
      {!isPremium && (
        <p>
          Upgrade to Premium and unlock the ability to download any of your
          submitted prediction file for the associated trained job
        </p>
      )}
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
          {isPremium ? preds : preds[0]}
        </Select>
      )}
      {load && <CircularProgress size={44} />}
      <br />
      <br />
      <Tooltip
        title="Download prediction file"
        aria-label="Download prediction file"
      >
        <Button
          variant="contained"
          component="span"
          disabled={preds.length < 1 || submitting}
          onClick={handleDlPredict}
          endIcon={<CloudDownloadIcon />}
        >
          Download Prediction File{" "}
          {submitting && <CircularProgress size={25} />}
        </Button>
      </Tooltip>
    </div>
  );

  return (
    <div>
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
