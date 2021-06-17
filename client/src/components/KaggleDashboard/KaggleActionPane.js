import React from "react";
import { Button, Paper } from "@material-ui/core";
import {
  CloudUpload,
  CloudDownload,
  Publish,
  AddCircle,
} from "@material-ui/icons";

const KaggleActionPane = () => {
  return (
    <div className="KagglePanel">
      <h4>Controls</h4>
      <Paper>
        <h4>Source Title and Type:</h4>
        <h5>Selected File name:</h5>
        <Button
          variant="contained"
          color="default"
          startIcon={<CloudDownload />}
        >
          Download File
        </Button>
        <Button variant="contained" color="default" startIcon={<AddCircle />}>
          Create Job from File
        </Button>
        <Button variant="contained" color="default" startIcon={<Publish />}>
          Upload Local File to Competition
        </Button>
        <Button variant="contained" color="default" startIcon={<CloudUpload />}>
          Upload Prediction from Completed Job
        </Button>
      </Paper>
    </div>
  );
};

export default KaggleActionPane;
