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
import { getJobPreds, getPredCol } from "./kaggleApi";
import CheckboxList from "./SelectList";

const KagglePredictDialog = () => {
  let source = useSelector((state) => state.kaggleReducer.source);
  let jobs = useSelector((state) => state.kaggleReducer.jobs);
  const [load, setLoad] = useState(false);
  const [preds, setPreds] = useState([]);
  const [pred, setPred] = useState("");
  const [unacceptable, setUnacceptable] = useState(true);
  const [init, setInit] = useState(true);
  const [columns, setColumns] = useState([]);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    return () => {
      setUnacceptable(true);
      setLoad(false);
      setInit(true);
      setColumns([]);
      setChecked([]);
    };
  }, []);

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

  // old handler for select box (in case autocomplete is buggy)
  //   const handleJobChange = (e) => {
  //     setLoad(true);
  //     setPred("");
  //     setInit(false);
  //     setUnacceptable(true);
  //     setChecked([]);
  //     handlePred(e.target.value);
  //     handleColumns(e.target.value);
  //   };

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
    } else {
      setInit(true);
    }
  };

  const handleDl = () => {
    // TODO
    console.log(pred);
    console.log(checked);
  };

  const handleSubmitToComp = () => {
    // TODO
    console.log(pred);
    console.log(checked);
  };

  const handleNewDataset = () => {
    // TODO
    console.log(pred);
    console.log(checked);
  };

  const handleAddToDataset = () => {
    // TODO
    console.log(pred);
    console.log(checked);
  };

  return (
    <div>
      <DialogTitle style={{ textAlign: "center" }}>
        Choose Prediction File
      </DialogTitle>
      <DialogContent style={{ overflow: "hidden" }}>
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
            {/* <Select required onChange={(e) => handleJobChange(e)}>
              {jobs}
            </Select> */}
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
            <Button onClick={handleNewDataset}>Create new dataset</Button>
            <Button onClick={handleAddToDataset}>
              Add to existing dataset
            </Button>
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
