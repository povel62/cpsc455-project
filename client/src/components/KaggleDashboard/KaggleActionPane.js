import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  Grid,
  InputLabel,
  FormControl,
  MenuItem,
  CircularProgress,
  Tooltip,
  ButtonGroup,
  Typography,
  DialogActions,
} from "@material-ui/core";
import { CloudDownload, AddCircle, CloudUpload } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { credentials, kaggleBaseUrl, competitionAuth } from "./kaggleApi";
import axios from "axios";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { green, red } from "@material-ui/core/colors";

const useStyles = makeStyles(() => ({
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "75%",
    bottom: "25%",
    left: "75%",
    right: "25%",
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  buttonFail: {
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700],
    },
  },
}));

const KaggleActionPane = (props) => {
  const classes = useStyles();
  let files = useSelector((state) => state.kaggleReducer.files);
  let datafile = useSelector((state) => state.kaggleReducer.dataFile);
  let source = useSelector((state) => state.kaggleReducer.source);
  let competitions = useSelector((state) => state.kaggleReducer.competitions);
  let datasets = useSelector((state) => state.kaggleReducer.datasets);
  let email = useSelector((state) => state.loginReducer.email);
  const [jobOpen, setJobOpen] = useState(false);
  const [time, setTime] = useState(5);
  const [nickname, setNickname] = useState("");
  const [target, setTarget] = useState("");
  const [submittingJob, setSubmittingJob] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [predictOpen, setPredictOpen] = useState(false);
  const [selectJob, setSelectJob] = useState({});
  const [offboard, setOffboard] = useState(false);
  const [jobs, setJobs] = useState([]);

  KaggleActionPane.propTypes = {
    tab: PropTypes.number.isRequired,
    setTab: PropTypes.func.isRequired,
  };

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonFail]: fail,
  });

  const fileRef = () => {
    if (!datafile) {
      return null;
    } else if (datafile.mode === "COMPETITION") {
      return files.data[datafile.index];
    } else {
      return files.data.datasetFiles[datafile.index];
    }
  };

  const sourceRef = () => {
    if (!datafile) {
      return null;
    } else if (datafile.mode === "COMPETITION") {
      return competitions[datafile.index].ref;
    } else {
      return datasets[datafile.index].ref;
    }
  };

  const fileDownload = (url, file) => {
    // TODO fix
    credentials(email).then((auth) => {
      axios
        .get(url, {
          responseType: "blob",
          auth: auth,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "*",
          },
          crossdomain: true,
        })
        .then((res) => {
          if (res.code === 403) {
            setOffboard(true);
          } else {
            const addr = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = addr;
            link.setAttribute("download", file.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(addr);
          }
        });
    });
  };

  const handleDownload = (download) => {
    let file = fileRef();
    let url = "";
    if (file) {
      if (datafile.mode === "COMPETITION") {
        competitionAuth(competitions[+source.index].ref, email).then(
          (entered) => {
            if (entered === false) {
              setOffboard(true);
            } else {
              url =
                kaggleBaseUrl +
                `/competitions/data/download/${
                  competitions[+source.index].ref
                }/${file.name}`;
              if (download) {
                fileDownload(url, file);
              }

              return url;
            }
          }
        );
      } else {
        url =
          kaggleBaseUrl + `/datasets/download/${file.datasetRef}/${file.name}`;
        if (download) {
          fileDownload(url, file);
        }
        return url;
      }
    }
  };

  const createJob = () => {
    setFail(false);
    setSuccess(false);
    setTime(5);
    if (datafile.mode === "COMPETITION") {
      competitionAuth(competitions[+source.index].ref, email).then(
        (entered) => {
          if (entered === true) {
            setJobOpen(true);
            let file = fileRef();
            if (file && file.columns && file.columns[0]) {
              setTarget(file.columns[0].name);
            } else {
              setTarget("");
            }
          } else {
            setOffboard(true);
          }
        }
      );
    } else {
      setJobOpen(true);
      let file = fileRef();
      if (file && file.columns && file.columns[0]) {
        setTarget(file.columns[0].name);
      } else {
        setTarget("");
      }
    }
  };

  const createPredict = () => {
    setFail(false);
    setSelectJob(null);
    setSuccess(false);
    // TODO fetch available jobs
    if (datafile.mode === "COMPETITION") {
      competitionAuth(competitions[+source.index].ref, email).then(
        (entered) => {
          if (entered === true) {
            setPredictOpen(true);
          } else {
            setOffboard(true);
          }
        }
      );
    } else {
      setPredictOpen(true);
    }
  };

  const getColumns = () => {
    let col = [];
    if (fileRef() && fileRef().columns) {
      let ref = fileRef().columns;
      ref.forEach((ele) => {
        col.push(ele.name);
      });
    }
    return col;
  };

  const handleColumn = (txt) => {
    setTarget(txt);
  };

  const handleNickname = (txt) => {
    setNickname(txt);
  };

  const handleSearchTime = (val) => {
    setTime(val);
  };

  const TargetColumn = () => {
    let col = getColumns();
    if (col.length > 0) {
      let options = col.map((ele, i) => {
        return (
          <MenuItem key={i} value={ele}>
            {ele}
          </MenuItem>
        );
      });
      return (
        <FormControl>
          <InputLabel>Target Column</InputLabel>
          <Select value={target} onChange={(e) => handleColumn(e.target.value)}>
            {options}
          </Select>
        </FormControl>
      );
    } else {
      return (
        <div>
          <TextField
            required
            onChange={(e) => handleColumn(e.target.value)}
            label={"Target Column"}
            title="Unable to automatically detect columns"
          ></TextField>{" "}
        </div>
      );
    }
  };

  const handleEnqueue = (e) => {
    e.preventDefault();
    setSuccess(false);
    setFail(false);
    setSubmittingJob(true);
    let sourceType = datafile ? datafile.mode : "invalid";
    axios
      .get("/api/user", { params: { email: email } })
      .then((user) => {
        let id = user.data.data.id;
        axios
          .post(`/api/kaggle/${id}/job`, {
            status: "CREATED",
            targetColumnName: target,
            name: nickname,
            durationLimit: time,
            kaggleSrc: handleDownload(),
            kaggleType: sourceType,
            kaggleId: sourceRef(),
          })
          .then((res) => {
            if (res.status === 201) {
              setSuccess(true);
              props.setTab(0); // goto dashboard if sucess to see pending job
            } else {
              setFail(true);
            }
          });
      })
      .catch(() => {
        setFail(true);
      })
      .finally(() => {
        setSubmittingJob(false);
      });
  };

  const handlePredict = (e) => {
    e.preventDefault();
    setSuccess(false);
    setFail(false);
    setSubmittingJob(true);
    let sourceType = datafile ? datafile.mode : "invalid";
    axios
      .post("/api/kaggle/predict", {
        job: selectJob,
        fileref: fileRef(),
        sourceType: sourceType,
        sourceref: sourceRef(),
        email: email,
      })
      .then((res) => {
        if (res.status === 200) {
          setSuccess(true);
          // goto dashboard if sucess to see pending job
          props.setTab(0);
        } else {
          setFail(true);
        }
      })
      .catch(() => {
        setFail(true);
      })
      .finally(() => {
        setSubmittingJob(false);
      });
  };

  const offboardToKaggle = () => {
    try {
      let url = competitions[source.index].url;
      if (url) {
        const kaggleWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (kaggleWindow) kaggleWindow.opener = null;
      }
    } catch (e) {
      // TODO error
      console.log(e);
    }
  };

  const handleSelectJob = (txt) => {
    setSelectJob(txt);
  };

  const userJobItems = () => {
    // jobs, setJobs;
    axios.get("/api/user", { params: { email: email } }).then((user) => {
      let id = user.data.data.id;
      axios
        .get(`/api/user/${id}/jobs`)
        .then((data) => {
          if (data.status === 200) {
            let jobData = data.data.data;
            console.log(data);
            if (jobData) {
              let elements = jobData.map((job, i) => {
                if (job.status !== "COMPLETED")
                  return (
                    <MenuItem value={job.id} key={i}>
                      {job.name}{" "}
                    </MenuItem>
                  );
              });
              setJobs(elements);
              console.log(elements);
            } else {
              setJobs([]);
            }
          }
        })
        .catch(() => {
          setJobs([]);
        });
    });
  };

  return (
    <div className="KagglePanel">
      <Dialog open={jobOpen} onClose={() => setJobOpen(false)}>
        <DialogTitle>Create Job</DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => handleEnqueue(e)}>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                {TargetColumn()}
              </Grid>
              <br />
              <Grid item xs={6}>
                <TextField
                  required
                  onChange={(e) => handleNickname(e.target.value)}
                  label="Job nickname"
                ></TextField>
              </Grid>
              <Grid item xs={6}>
                <br />
                <FormControl>
                  <InputLabel>Search Time Limit</InputLabel>
                  <Select
                    onChange={(e) => handleSearchTime(e.target.value)}
                    value={time}
                  >
                    <MenuItem value={5}>5 minutes</MenuItem>
                    <MenuItem value={20}>20 minutes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <br />
                <Tooltip
                  open={true}
                  title={fail ? "Failed to submit job." : ""}
                  placement="right"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submittingJob}
                    className={buttonClassname}
                  >
                    Queue Job
                  </Button>
                </Tooltip>
                {submittingJob && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={predictOpen} onClose={() => setPredictOpen(false)}>
        <DialogTitle>
          Submit Prediction File for Automatic Classification
        </DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => handlePredict(e)}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <InputLabel>Available Trained Jobs</InputLabel>
                <Select
                  onChange={(e) => handleSelectJob(e.target.value)}
                  value={selectJob}
                  required
                >
                  {jobs}
                </Select>
              </Grid>
              <Grid item xs={6}>
                <Tooltip
                  open={true}
                  title={fail ? "Failed to submit prediction file" : ""}
                  placement="right"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submittingJob}
                    className={buttonClassname}
                  >
                    Predict
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </form>
          <br />
        </DialogContent>
      </Dialog>
      <Paper>
        <h4>Options</h4>
        {datafile && (
          <div>
            <h4>{fileRef().description}</h4>
            <h5>Size: {fileRef().totalBytes} bytes</h5>
            <ButtonGroup
              size="medium"
              color="primary"
              aria-label="medium contained button group"
            >
              <Button
                variant="contained"
                startIcon={<CloudDownload />}
                onClick={() => handleDownload(true)}
              >
                Download File
              </Button>
              <Tooltip
                title={"Limited to CSV files"}
                placement="bottom"
                disableFocusListener={datafile.accepted}
                disableHoverListener={datafile.accepted}
                disableTouchListener={datafile.accepted}
              >
                <span>
                  <Button
                    variant="contained"
                    startIcon={<AddCircle />}
                    onClick={() => createJob()}
                    disabled={!datafile.accepted}
                  >
                    Create Training Job
                  </Button>
                </span>
              </Tooltip>
              <Tooltip
                title={"Limited to CSV files"}
                placement="bottom"
                disableFocusListener={datafile.accepted}
                disableHoverListener={datafile.accepted}
                disableTouchListener={datafile.accepted}
              >
                <span>
                  <Button
                    variant="contained"
                    startIcon={<CloudUpload />}
                    onClick={() => {
                      userJobItems();
                      createPredict();
                    }}
                    disabled={!datafile.accepted}
                  >
                    Auto Classify
                  </Button>
                </span>
              </Tooltip>
            </ButtonGroup>
          </div>
        )}
      </Paper>
      <Dialog open={offboard} onClose={() => setOffboard(false)}>
        <DialogTitle gutterBottom variant="h5" component="h2">
          You must accept the competition rules
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" component="p">
                Unfortunately, due to Kaggle’s policies, you must read and
                accept the competition rules to access these files.
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={() => offboardToKaggle()}
          >
            Open competition page
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default KaggleActionPane;
