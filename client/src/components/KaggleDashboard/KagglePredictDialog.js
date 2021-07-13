import { React, useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { getJobPreds, getPredCol, sourceRef } from "./kaggleApi";
import CheckboxList from "./SelectList";
import axios from "axios";
import PropTypes from "prop-types";

const KagglePredictDialog = (props) => {
  let source = useSelector((state) => state.kaggleReducer.source);
  let jobs = useSelector((state) => state.kaggleReducer.jobs);
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

  useEffect(() => {
    return () => {
      setUnacceptable(true);
      setLoad(false);
      setInit(true);
      setColumns([]);
      setChecked([]);
      setJob(null);
    };
  }, []);

  KagglePredictDialog.propTypes = {
    open: PropTypes.number.isRequired,
    setOpen: PropTypes.func.isRequired,
  };

  let { open, setOpen } = props;

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
    console.log(job);
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
    // TODO switch on e type to allow for clear button to work
    if (newVal) {
      setLoad(true);
      setPred("");
      setInit(false);
      setUnacceptable(true);
      setChecked([]);
      handlePred(newVal.value);
      handleColumns(newVal.value);
      setJob(newVal.value);
    } else {
      setInit(true);
    }
  };

  const handleDl = () => {
    let cols = checked.map((ele) => {
      return columns[ele];
    });
    axios
      .get(`/api/job/${job}/pred/${pred}`, { params: { cols: cols } })
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
        } else {
          // TODO turn btn red for err
        }
      })
      .catch((err) => {
        // TODO turn btn red for err
        console.log(err);
      });
  };

  const handleSubmitToComp = () => {
    console.log(job);
    console.log(pred);
    console.log(checked);
    console.log(sourceRef(source, datasets, competitions));
    let ref = sourceRef(source, datasets, competitions);
    let checkedCols = checked.map((ele) => {
      return columns[ele];
    });
    console.log(checkedCols);
    axios
      .get("/api/user", { params: { email: email } })
      .then((user) => {
        let id = user.data.data.id;
        axios
          .post(`/api/kaggle/${id}/${job}/competitions/${ref}/submit/${pred}`, {
            params: { cols: checkedCols },
          })
          .then((res) => {
            if (res.status === 201) {
              console.log("Success");
              if (open) {
                setOpen(false);
              }
            } else {
              console.log("Fail");

              // TODO turn btn red for err
            }
          });
      })
      .catch((err) => {
        console.log(err);
        // TODO turn btn red for err
      });
  };

  const handleNewDataset = () => {
    // TODO let user choose name
    console.log(job);
    console.log(pred);

    console.log(sourceRef(source, datasets, competitions));
    let checkedCols = checked.map((ele) => {
      return columns[ele];
    });
    console.log(checkedCols);
    try {
      let ref = sourceRef(source, datasets, competitions);
      let title = ref.split("/")[1].replace(/[^a-z0-9]/gi, ""); // todo more input cleaning?
      if (title.length > 39) {
        // trim excess while keeping prediction label
        let i = title.length - 39;
        title = title.substring(i);
      }
      console.log(title);
      // "/kaggle/:id/:jid/datasets/version/new/:name"
      axios
        .get("/api/user", { params: { email: email } })
        .then((user) => {
          let id = user.data.data.id;
          axios
            .post(`/api/kaggle/${id}/${job}/datasets/version/new/${pred}`, {
              params: { cols: checkedCols, title: title },
            })
            .then((res) => {
              if (res.status === 201) {
                console.log("Success");
                if (open) {
                  setOpen(false);
                }
              } else {
                console.log("Fail");

                // TODO turn btn red for err
              }
            })
            .catch((err) => {
              console.log(err);
              // TODO turn btn red for err
            });
        })
        .catch((e) => {
          console.log(e);
          // TODO turn btn red for err
        });
    } catch (e) {
      console.log(e);
      // TODO fail
    }
  };

  return (
    <div>
      <DialogTitle style={{ textAlign: "center" }}>
        Choose Prediction File
      </DialogTitle>
      <DialogContent style={{ overflow: "hidden", minHeight: "45vh" }}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <h4>Select Job</h4>
            <Autocomplete
              required
              options={jobs.map((e) => {
                return {
                  title: e.props["data-my-value"],
                  value: e.props.value,
                };
              })}
              getOptionLabel={(option) => option.title}
              autoHighlight
              fullWidth
              loading={load}
              disabled={load}
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
          </Grid>
          <Grid item xs={4}>
            <h4>Select Prediction File</h4>
            {init && <p>Select A Job First</p>}
            {load && <CircularProgress />}
            {!load && preds && preds.length > 0 && (
              <Select
                required
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
            <h4>Select Desired Columns</h4>
            {init && <p>Select A Job First</p>}
            {!unacceptable && (
              <CheckboxList
                cols={columns}
                checked={checked}
                setChecked={setChecked}
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
          <ButtonGroup
            size="small"
            color="primary"
            aria-label="small contained button group"
            fullWidth={true}
            variant="contained"
            disabled={unacceptable}
          >
            <Button onClick={handleNewDataset}>
              Create new private dataset
            </Button>
            <Button disabled>Add to existing dataset (not ready)</Button>
            <Button onClick={handleDl}> Download </Button>
          </ButtonGroup>
        )) ||
          (source && source.mode === "COMPETITION" && (
            <ButtonGroup
              size="small"
              color="primary"
              aria-label="small contained button group"
              fullWidth={true}
              variant="contained"
              disabled={unacceptable}
            >
              <Button onClick={handleSubmitToComp}>
                Submit to Competition
              </Button>
              <Button onClick={handleDl}> Download </Button>
            </ButtonGroup>
          ))}
      </DialogActions>
    </div>
  );
};
export default KagglePredictDialog;
