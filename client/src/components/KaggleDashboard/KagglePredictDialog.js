import { React, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Select,
  Button,
  ButtonGroup,
  DialogContent,
  DialogActions,
  DialogTitle,
  MenuItem,
  CircularProgress,
  TextField,
  Popper,
  Paper,
  Fade,
  Tooltip,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { getJobPreds, getPredCol, sourceRef } from "./kaggleApi";
import CheckboxList from "./SelectList";
import axios from "axios";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { green, red } from "@material-ui/core/colors";
import { setKaggleSuccess } from "../../redux/actions/actions";
import { LooksOne, LooksTwo, Looks3, Send } from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "75%",
    bottom: "25%",
    left: "58%",
    right: "32%",
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
    submitSpinner: {
      // TODO make this centered!
      left: "80%",
      right: "20%",
    },
    popperStyle: {
      zIndex: 9999,
    },
  },
}));

const KagglePredictDialog = (props) => {
  let source = useSelector((state) => state.kaggleReducer.source);
  let jobs = useSelector((state) => state.kaggleReducer.kjobs);
  let datasets = useSelector((state) => state.kaggleReducer.datasets);
  let competitions = useSelector((state) => state.kaggleReducer.competitions);
  let email = useSelector((state) => state.loginReducer.email);
  const [load, setLoad] = useState(false);
  const [preds, setPreds] = useState([]);
  const [pred, setPred] = useState("");
  const [unacceptable, setUnacceptable] = useState(true);
  const [init, setInit] = useState(true);
  const [columns, setColumns] = useState([]);
  const [checked, setChecked] = useState([]);
  const [job, setJob] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [popperOpen, setPopperOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadName, setUploadName] = useState("");
  let dispatch = useDispatch();

  useEffect(() => {
    return () => {
      setUnacceptable(true);
      setLoad(false);
      setInit(true);
      setColumns([]);
      setChecked([]);
      setJob(null);
      setSuccess(false);
      setError(false);
      setSubmitting(false);
      setPredictCanClose(true);
      setPopperOpen(false);
      setErrorMessage("");
      setUploadName("");
    };
  }, []);

  KagglePredictDialog.propTypes = {
    open: PropTypes.number.isRequired,
    setOpen: PropTypes.func.isRequired,
    setPredictCanClose: PropTypes.func.isRequired,
    setTab: PropTypes.func.isRequired,
  };

  let { open, setOpen, setPredictCanClose, setTab } = props;
  let classes = useStyles();

  const submitBtn = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonFail]: error,
  });

  const downloadBtn = clsx({
    [classes.buttonFail]: error,
  });

  const submitError = (message) => {
    setSuccess(false);
    setError(true);
    setSubmitting(false);
    setPredictCanClose(true);
    setErrorMessage(message);
    setPopperOpen(false);
  };

  const submitSuccess = () => {
    setSuccess(true);
    setError(false);
    setSubmitting(false);
    setPredictCanClose(true);
    setOpen(false);
    dispatch(setKaggleSuccess(true));
    setErrorMessage("");
    setTimeout(() => {
      setTab(0);
      dispatch(setKaggleSuccess(false));
    }, 2000);
  };

  const resetErrors = () => {
    setSuccess(false);
    setError(false);
  };

  const handlePred = (choice) => {
    getJobPreds(choice)
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
        setLoad(false);
        setPreds(entries);
      })
      .catch(() => {
        setPreds([]);
      });
  };

  const handleColumns = (job) => {
    getPredCol(job)
      .then((cols) => {
        setColumns(cols);
      })
      .catch(() => {
        setColumns([]);
      });
  };

  // eslint-disable-next-line no-unused-vars
  const handleJobChange = (e, newVal) => {
    if (newVal) {
      setLoad(true);
      setPred("");
      setInit(false);
      setUnacceptable(true);
      setChecked([]);
      handlePred(newVal.value);
      handleColumns(newVal.value);
      setJob({
        id: newVal.value,
        kaggleType: newVal.kaggleType,
        kaggleId: newVal.kaggleId,
      });
      resetErrors();
      setSubmitting(false);
    } else {
      setInit(true);
    }
  };

  const handleDl = () => {
    resetErrors();
    let cols = checked.map((ele) => {
      return columns[ele];
    });
    setSubmitting(true);
    setPredictCanClose(false);
    axios
      .get(`/api/job/${job.id}/pred/${pred}`, { params: { cols: cols } })
      .then((res) => {
        if (res.status === 200) {
          let name = pred;
          const addr = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = addr;
          link.setAttribute("download", name);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(addr);
          resetErrors();
          setSubmitting(false);
          setPredictCanClose(true);
        } else {
          submitError("Download failed");
        }
      })
      .catch(() => {
        submitError("Download failed");
      });
  };

  const handleSubmitToComp = () => {
    let ref = sourceRef(source, datasets, competitions);
    let checkedCols = checked.map((ele) => {
      return columns[ele];
    });
    resetErrors();
    setSubmitting(true);
    setPredictCanClose(false);
    // TODO change to JWT
    axios
      .get("/api/user", { params: { email: email } })
      .then((user) => {
        let id = user.data.data.id;
        axios
          .post(
            `/api/kaggle/${id}/${job.id}/competitions/${ref}/submit/${pred}`,
            {
              params: { cols: checkedCols, title: uploadName },
            }
          )
          .then((res) => {
            if (res.status === 201) {
              submitSuccess();
              if (open) {
                setTimeout(() => setOpen(false), 500);
              }
            } else {
              submitError("Upload failed, are you using a unique name?");
            }
          })
          .catch(() => {
            submitError("Upload failed, are you using a unique name?");
          });
      })
      .catch(() => {
        submitError("Upload failed, are you using a unique name?");
      });
  };

  const handleNewDataset = () => {
    resetErrors();
    let checkedCols = checked.map((ele) => {
      return columns[ele];
    });
    try {
      setSubmitting(true);
      setPredictCanClose(false);
      // TODO change to JWT
      axios
        .get("/api/user", { params: { email: email } })
        .then((user) => {
          let id = user.data.data.id;
          axios
            .post(`/api/kaggle/${id}/${job.id}/datasets/version/new/${pred}`, {
              params: { cols: checkedCols, title: uploadName },
            })
            .then((res) => {
              if (res.status === 201) {
                submitSuccess();
                if (open) {
                  setTimeout(() => setOpen(false), 500);
                }
              } else {
                submitError("Upload failed, are you using a unique name?");
              }
            })
            .catch(() => {
              submitError("Upload failed, are you using a unique name?");
            });
        })
        .catch(() => {
          submitError("Upload failed, are you using a unique name?");
        });
    } catch (e) {
      submitError("Upload failed, are you using a unique name?");
    }
  };

  const handlePopperClick = (event) => {
    setAnchorEl(event.currentTarget);
    setPopperOpen(!popperOpen);
  };

  return (
    <div>
      <DialogTitle style={{ textAlign: "center" }}>
        Choose Prediction File
      </DialogTitle>
      <DialogContent style={{ overflow: "hidden", minHeight: "45vh" }}>
        <Popper
          open={popperOpen}
          anchorEl={anchorEl}
          placement="top"
          transition
          className={classes.popperStyle}
          style={{ zIndex: 99999 }}
          disablePortal={true}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper elevation={9}>
                <h4>Please Choose a Submission Title</h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (uploadName.length < 6) {
                      submitError("Please choose a 6-50 character name");
                      return;
                    }
                    console.log(uploadName);
                    if (source && source.mode) {
                      if (source.mode === "COMPETITION") {
                        handleSubmitToComp();
                      } else if (source.mode === "DATA") {
                        handleNewDataset();
                      }
                    }
                  }}
                >
                  <TextField
                    required
                    value={uploadName}
                    onChange={(e) => {
                      let str = e.target.value;
                      str = str.replace(/[^a-z0-9]/gi, "");
                      if (str.length > 50) {
                        str = str.substring(50);
                      }
                      setUploadName(str);
                    }}
                  ></TextField>
                  <Button type="submit" endIcon={<Send />} />
                </form>
              </Paper>
            </Fade>
          )}
        </Popper>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <LooksOne style={{ textAlign: "center", alignSelf: "center" }} />
            <br />
            <h4>Select Job</h4>
            <Autocomplete
              required
              options={jobs.map((e) => {
                return {
                  title: e.props["data-my-value"].title,
                  value: e.props.value,
                  kaggleId: e.props["data-my-value"].kaggleId,
                  kaggleType: e.props["data-my-value"].kaggleType,
                };
              })}
              getOptionLabel={(option) => option.title}
              autoHighlight
              fullWidth
              // getOptionSelected={(option, value) => {
              //   console.log(option);
              //   console.log(value);
              //   return option.title === value.title;
              // }}
              loading={load}
              disabled={load || submitting}
              onChange={(e, val) => handleJobChange(e, val)}
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select a Job"
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill
                  }}
                />
              )}
            ></Autocomplete>
            <div>
              {!init && !load && job && job.kaggleId && job.kaggleType && (
                <p>
                  Source: {job.kaggleId} ({job.kaggleType}){" "}
                </p>
              )}
              {!init && !load && job && <p> Top Score: TODO</p>}
              {!init && !load && job && (!job.kaggleId || !job.kaggleType) && (
                <p>No Associated Kaggle Source </p>
              )}
            </div>
          </Grid>
          <Grid item xs={4}>
            <LooksTwo style={{ textAlign: "center", alignSelf: "center" }} />
            <br />
            <h4>Select Prediction File</h4>
            {init && <p>Select A Job First</p>}
            {load && <CircularProgress />}
            {!load && preds && preds.length > 0 && (
              <Select
                required
                disabled={load || submitting}
                defaultValue={() => {
                  if (preds && preds.length >= 1) {
                    setUnacceptable(false);
                    setPred(preds[0].props.value);
                    return preds[0].props.value;
                  }
                }}
                onChange={(e) => {
                  if (e.target.value) {
                    if (e.target.value !== "") {
                      setUnacceptable(false);
                    }
                    setPred(e.target.value);
                  }
                }}
              >
                {preds}
              </Select>
            )}
            {!load && !init && (!preds || preds.length === 0) && (
              <p>No Files Available</p>
            )}
          </Grid>
          <Grid item xs={4}>
            <Looks3 style={{ textAlign: "center", alignSelf: "center" }} />
            <br />
            <h4>Select Desired Columns</h4>
            {init && <p>Select A Job First</p>}
            {!unacceptable && preds && preds.length !== 0 && (
              <CheckboxList
                cols={columns}
                checked={checked}
                setChecked={setChecked}
                submitting={submitting}
              />
            )}
            {load && <CircularProgress />}
            {!load && !init && (!preds || preds.length === 0) && (
              <p>Please Choose a Job with Available Files</p>
            )}
            {!load &&
              !init &&
              preds &&
              preds.length !== 0 &&
              (!pred || pred === "") && <p>Please Choose a Job</p>}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {(source && source.mode === "DATA" && (
          <Tooltip
            title={errorMessage}
            placement="top"
            disableFocusListener={true}
            disableHoverListener={true}
            disableTouchListener={true}
            open={error}
          >
            <ButtonGroup
              size="small"
              color="primary"
              aria-label="small contained button group"
              fullWidth={true}
              variant="contained"
              disabled={unacceptable || submitting || !pred || pred === ""}
            >
              <Button
                onClick={(e) => handlePopperClick(e)}
                className={submitBtn}
              >
                Create new private dataset
                {submitting && (
                  <CircularProgress
                    size={18}
                    className={classes.submitSpinner}
                  />
                )}
              </Button>
              {/* <Button disabled>Add to existing dataset (not ready)</Button> */}
              <Button onClick={handleDl} className={downloadBtn}>
                {" "}
                Download{" "}
              </Button>
            </ButtonGroup>
          </Tooltip>
        )) ||
          (source && source.mode === "COMPETITION" && (
            <Tooltip
              title={errorMessage}
              placement="top"
              disableFocusListener={true}
              disableHoverListener={true}
              disableTouchListener={true}
              open={error}
            >
              <ButtonGroup
                size="small"
                color="primary"
                aria-label="small contained button group"
                fullWidth={true}
                variant="contained"
                disabled={unacceptable || submitting || !pred || pred === ""}
              >
                <Button
                  onClick={(e) => handlePopperClick(e)}
                  className={submitBtn}
                >
                  Submit to Competition
                  {submitting && (
                    <CircularProgress
                      size={18}
                      className={classes.submitSpinner}
                    />
                  )}
                </Button>
                <Button onClick={handleDl} className={downloadBtn}>
                  {" "}
                  Download{" "}
                </Button>
              </ButtonGroup>
            </Tooltip>
          ))}
      </DialogActions>
    </div>
  );
};
export default KagglePredictDialog;
