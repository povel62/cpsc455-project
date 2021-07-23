import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { useSelector } from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import ErrorOutlinedIcon from "@material-ui/icons/ErrorOutlined";
import Grid from "@material-ui/core/Grid";
import { FaTimesCircle } from "react-icons/fa";
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
    width: "70vw",
    height: "70vh",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function ErrorModal(props) {
  const axios = require("axios");
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [searchOutText, setSearchOutText] = useState([]);
  const [searchErrorText, setSearchErrorText] = useState([]);
  const [predictOutText, setPredictOutText] = useState([]);
  const [predictErrorText, setPredictErrorText] = useState([]);
  const [loadingSO, setLoadingSO] = useState(false);
  const [loadingSE, setLoadingSE] = useState(false);
  const [loadingPO, setLoadingPO] = useState(false);
  const [loadingPE, setLoadingPE] = useState(false);

  const login_token = useSelector((state) => state.loginReducer);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      setLoadingSO(true);
      setLoadingSE(true);
      setLoadingPO(true);
      setLoadingPE(true);
      axios
        .get(`/api/job/` + props.jobId + "/file/slurm_search.out", {
          headers: {
            Authorization: "Bearer " + login_token.accessToken,
          },
        })
        .then((response) => {
          setSearchOutText(response.data);
          setLoadingSO(false);
        })
        .catch((error) => {
          setSearchOutText(["N/A"]);
          console.log(error);

          setLoadingSO(false);
        });

      axios
        .get(`/api/job/` + props.jobId + "/file/slurm_search.err", {
          headers: {
            Authorization: "Bearer " + login_token.accessToken,
          },
        })
        .then((response) => {
          setLoadingSE(false);

          setSearchErrorText(response.data);
        })
        .catch((error) => {
          setLoadingSE(false);
          console.log(error);

          setSearchErrorText(["N/A"]);
        });

      axios
        .get(`/api/job/` + props.jobId + "/file/slurm_predict.out", {
          headers: {
            Authorization: "Bearer " + login_token.accessToken,
          },
        })
        .then((response) => {
          setLoadingPO(false);

          setPredictOutText(response.data);
        })
        .catch((error) => {
          setLoadingPO(false);
          console.log(error);

          setPredictOutText(["N/A"]);
        });

      axios
        .get(`/api/job/` + props.jobId + "/file/slurm_predict.err", {
          headers: {
            Authorization: "Bearer " + login_token.accessToken,
          },
        })
        .then((response) => {
          setLoadingPE(false);
          setPredictErrorText(response.data);
        })
        .catch((error) => {
          setLoadingPE(false);
          console.log(error);
          setPredictErrorText(["N/A"]);
        });
    }
  }, [open]);

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
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{ height: "50%" }}
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{ height: "100%" }}
        >
          <Grid item xs={6} style={{ height: "100%" }}>
            <h2> Search Output File: </h2>{" "}
            {loadingSO && <CircularProgress size={24} />}
            <p style={{ height: "80%", overflowY: "auto" }}>
              <ul>
                {searchOutText.map((x, i) => {
                  return <li key={i}>{x}</li>;
                })}
              </ul>
            </p>
          </Grid>
          <Grid item xs={6} style={{ height: "100%" }}>
            <h2> Search Error File: </h2>{" "}
            {loadingSE && <CircularProgress size={24} />}
            <p style={{ height: "80%", overflowY: "auto" }}>
              <ul>
                {searchErrorText.map((x, i) => {
                  return <li key={i}>{x}</li>;
                })}
              </ul>
            </p>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{ height: "100%" }}
        >
          <Grid item xs={6} style={{ height: "100%" }}>
            <h2> Predict Output File: </h2>{" "}
            {loadingPO && <CircularProgress size={24} />}
            <p style={{ height: "80%", overflowY: "auto" }}>
              <ul>
                {predictOutText.map((x, i) => {
                  return <li key={i}>{x}</li>;
                })}
              </ul>
            </p>
          </Grid>
          <Grid item xs={6} style={{ height: "100%" }}>
            <h2> Predict Error File: </h2>{" "}
            {loadingPE && <CircularProgress size={24} />}
            <p style={{ height: "80%", overflowY: "auto" }}>
              <ul>
                {predictErrorText.map((x, i) => {
                  return <li key={i}>{x}</li>;
                })}
              </ul>
            </p>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );

  return (
    <div>
      <Tooltip title="Check job logs" aria-label="Check job logs">
        <IconButton
          color="primary"
          aria-label="Check job logs"
          onClick={handleOpen}
          size="large"
        >
          <ErrorOutlinedIcon />
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
