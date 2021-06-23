import React, { useState } from "react";
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
} from "@material-ui/core";
import { CloudDownload, AddCircle } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import { credentials, kaggleBaseUrl } from "./kaggleApi";
import axios from "axios";
import { set_loading } from "../../redux/actions/actions";

const KaggleActionPane = () => {
  let files = useSelector((state) => state.kaggleReducer.files);
  let datafile = useSelector((state) => state.kaggleReducer.dataFile);
  let source = useSelector((state) => state.kaggleReducer.source);
  let competitions = useSelector((state) => state.kaggleReducer.competitions);
  let email = useSelector((state) => state.loginReducer.email);
  let dispatch = useDispatch();
  const [jobOpen, setJobOpen] = useState(false);
  const [time, setTime] = useState(5);
  const [nickname, setNickname] = useState("");
  const [target, setTarget] = useState("");

  const fileRef = () => {
    if (!datafile) {
      return null;
    } else if (datafile.mode === "COMPETITION") {
      return files.data[datafile.index];
    } else {
      return files.data.datasetFiles[datafile.index];
    }
  };

  const fileDownload = () => {
    // TODO probably broken and needs a fix for the cors issue!
    let file = fileRef();
    let url = "";
    if (file) {
      if (datafile.mode === "COMPETITION") {
        url =
          kaggleBaseUrl +
          `/competitions/data/download/${competitions[+source.index].ref}/${
            file.name
          }`;
      } else {
        url =
          kaggleBaseUrl + `/datasets/download/${file.datasetRef}/${file.name}`;
      }
      // axios
      //   .get("/api/kaggle/getKaggleFile", { params: { url: url }, auth: token })
      //   .then((res) => {
      //     console.log(res);
      //   });
      axios
        .get(url, {
          responseType: "blob",
          auth: credentials(email),
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "*",
          },
          crossdomain: true,
        })
        .then((res) => {
          if (res.code === 403) {
            console.log("unauthorized");
            // TODO put message about joining competition and accepting rules prior to data download
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
    }
  };

  const createJob = () => {
    setJobOpen(true);
    let file = fileRef();
    if (file && file.columns && file.columns[0]) {
      setTarget(file.columns[0].name);
    } else {
      setTarget("");
    }
  };

  const getColumns = () => {
    let col = [];
    if (fileRef() && fileRef().columns) {
      console.log(fileRef().columns);
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
            onChange={(e) => handleColumn(e.target.value)}
            label={"Target Column"}
          ></TextField>{" "}
        </div>
      );
    }
  };

  const handleEnqueue = (e) => {
    e.preventDefault();
    setJobOpen(false);
    dispatch(set_loading(true));
    axios
      .post("/api/kaggle/job", {
        target: target,
        nickname: nickname,
        searchTime: time,
      })
      .then((res) => {
        // TODO go to finished screen if 200
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        // TODO error message
      })
      .finally(() => {
        dispatch(set_loading(false));
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
                  <InputLabel>Search Time</InputLabel>
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
                <Button variant="contained" color="primary" type="submit">
                  Queue Job
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <Paper>
        <h4>Controls</h4>
        {datafile && (
          <div>
            <h4>{fileRef().description}</h4>
            <h5>Size: {fileRef().totalBytes} bytes</h5>
            <Button
              variant="contained"
              color="default"
              startIcon={<CloudDownload />}
              onClick={() => fileDownload()}
            >
              Download File
            </Button>
            <Button
              variant="contained"
              color="default"
              startIcon={<AddCircle />}
              onClick={() => createJob()}
            >
              Create Job from File
            </Button>
          </div>
        )}
      </Paper>
    </div>
  );
};

export default KaggleActionPane;
