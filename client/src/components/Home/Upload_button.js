import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
//import IconButton from "@material-ui/core/IconButton";
//import PhotoCamera from "@material-ui/icons/PhotoCamera";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}));

export default function UploadButtons() {
  function handleFiles({ target }) {
    /*const fileReader = new FileReader();
  const name = target.accept.includes("image") ? "images" : "videos";

  fileReader.readAsDataURL(target.files[0]);
  fileReader.onload = (e) => {
    this.setState((prevState) => ({
      [name]: [...prevState[name], e.target.result],
    }));
    };*/

    var reader = new FileReader();

    reader.readAsText(target.files[0]);

    reader.onload = (e) => {
      // Use reader.result
      alert(e.target.result);
    };
  }

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <input
        accept=".csv"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
        onChange={handleFiles}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          Upload File
        </Button>
      </label>

      {/*<input
        accept="image/*"
        className={classes.input}
        id="icon-button-file"
        type="file"
      />
      <label htmlFor="icon-button-file">
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
        >
          <PhotoCamera />
        </IconButton>
      </label>*/}
    </div>
  );
}
