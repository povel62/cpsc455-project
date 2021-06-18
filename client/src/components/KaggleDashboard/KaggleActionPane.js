import React from "react";
import { Paper, Button } from "@material-ui/core";
import {
  CloudUpload,
  CloudDownload,
  Publish,
  AddCircle,
} from "@material-ui/icons";
import { useSelector } from "react-redux";

const KaggleActionPane = () => {
  let files = useSelector((state) => state.kaggleReducer.files);
  let datafile = useSelector((state) => state.kaggleReducer.dataFile);

  const fileRef = () => {
    if (!datafile) {
      return null;
    } else if (datafile.mode === "COMPETITION") {
      console.log(files.data[datafile.index]);
      return files.data[datafile.index];
    } else {
      console.log(files.data.datasetFiles[datafile.index]);
      return files.data.datasetFiles[datafile.index];
    }
  };

  return (
    <div className="KagglePanel">
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
            >
              Download File
            </Button>
            <Button
              variant="contained"
              color="default"
              startIcon={<AddCircle />}
            >
              Create Job from File
            </Button>
            <Button variant="contained" color="default" startIcon={<Publish />}>
              Upload Local File to Competition
            </Button>
            <Button
              variant="contained"
              color="default"
              startIcon={<CloudUpload />}
            >
              Upload Prediction from Completed Job
            </Button>
            <h4>Column explorer</h4>
          </div>
        )}
      </Paper>
    </div>
  );
};

export default KaggleActionPane;
