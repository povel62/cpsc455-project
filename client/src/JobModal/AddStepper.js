import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { useSelector } from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";
import UploadButtons from "../components/Upload_button/Upload_button";
import PropTypes from "prop-types";

const computeTimes = [
  {
    value: 5,
    label: "5 minutes",
  },
  {
    value: 20,
    label: "20 minutes",
  },
  {
    value: 60,
    label: "1 hour",
  },
  {
    value: 360,
    label: "6 hours",
  },
  {
    value: 1440,
    label: "24 hours",
  },
  {
    value: 2880,
    label: "48 hours",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function AddStepper() {
  const login_token = useSelector((state) => state.loginReducer);
  const classes = useStyles();

  const [target_col, setTarget] = useState("");
  const [data, setData] = useState(null);

  const [values, setValues] = useState({
    response: "",
    post: "",
    responseToPost: "",
    jobName: "",
    jobTime: 5,
    guest: login_token.isGuest,
  });

  function getSteps() {
    return ["Configure", "Upload Dataset", "Review & Submit"];
  }

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <TextField
              autoComplete="job_nickName"
              name="JobName"
              variant="outlined"
              required
              fullWidth
              id="JobName"
              defaultValue={values.jobName}
              label="Job Name"
              autoFocus
              onChange={(e) =>
                setValues({ ...values, jobName: e.target.value })
              }
            />
            <br />
            <br />

            <TextField
              id="job_time"
              select
              label="Select compute time"
              value={values.jobTime}
              onChange={(e) =>
                setValues({
                  ...values,
                  jobTime: e.target.value,
                })
              }
              helperText="Please select compute time"
            >
              {computeTimes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
        );
      case 1:
        return (
          <div>
            <p> Upload your Dataset</p>
            <UploadButtons
              changeTarget={(target_col) => setTarget(target_col)}
              changeData={(data) => setData(data)}
            ></UploadButtons>
          </div>
        );
      case 2:
        return (
          <div>
            <TextField
              id="jb name"
              label="Job Name"
              defaultValue={values.jobName}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
            <br />
            <br />
            <TextField
              id="jb time"
              label="Compute Time"
              defaultValue={
                computeTimes.filter(
                  (option) => option.value == values.jobTime
                )[0].label
              }
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
        );
      default:
        return "Unknown stepIndex";
    }
  }

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length - 1) {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    //e.preventDefault();

    console.log(data);

    const formData = new FormData();

    // Update the formData object
    formData.append("file", data);
    formData.append("name", values.jobName);
    formData.append("durationLimit", values.jobTime);
    formData.append("targetColumnName", target_col);

    const response = await fetch("/api/user/job/upload", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + login_token.accessToken,
      },
      body: formData,
    });

    if (response.status === 201 || response.status === 200) {
      alert(response.status);
    } else {
      //resetValues();
      alert(response.status);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    console.log(target_col);
    console.log(data);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              {values.jobName === "" ? (
                <Button disabled variant="contained" color="primary">
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? "Submit" : "Next"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

AddStepper.PropTypes = {
  changeTarget: PropTypes.func,
  changeData: PropTypes.func,
};

export default AddStepper;
