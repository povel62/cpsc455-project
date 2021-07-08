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
} from "@material-ui/core";
import { getJobPreds } from "./kaggleApi";

const KagglePredictDialog = () => {
  let source = useSelector((state) => state.kaggleReducer.source);
  let jobs = useSelector((state) => state.kaggleReducer.jobs);
  const [load, setLoad] = useState(false);
  const [preds, setPreds] = useState([]);
  const [pred, setPred] = useState("");
  const [unacceptable, setUnacceptable] = useState(true);
  const [init, setInit] = useState(true);

  useEffect(() => {
    return () => {
      setUnacceptable(true);
      setLoad(false);
      setInit(true);
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

  const handleJobChange = (e) => {
    setLoad(true);
    setPred("");
    setInit(false);
    setUnacceptable(true);
    handlePred(e.target.value);
  };

  const handleDl = () => {
    console.log(pred);
  };

  return (
    <div>
      <DialogTitle>Choose Prediction File</DialogTitle>
      <DialogContent style={{ overflow: "hidden" }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <h4>Select Job</h4>
            <Select required onChange={(e) => handleJobChange(e)}>
              {jobs}
            </Select>
          </Grid>
          <Grid item xs={6}>
            <h4>Select Prediction File</h4>
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
            <Button>Create new dataset</Button>
            <Button>Add to existing dataset</Button>
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
              <Button>Submit to Competition</Button>
              <Button onClick={handleDl}> Download </Button>
            </ButtonGroup>
          ))}
      </DialogActions>
    </div>
  );
};

export default KagglePredictDialog;
