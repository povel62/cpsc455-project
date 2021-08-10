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
import UploadButtons from "../Upload_button/Upload_button";
import { CircularProgress } from "@material-ui/core";
import PropTypes from "prop-types";
import { computeTimes, computeTimesPremium } from "./trainingTimes";

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

function AddStepper({
  setTab,
  setOpenSnackBar,
  setSnackBarContent,
  handleClose,
}) {
  let isPremium = useSelector((state) => state.loginReducer.premium);
  const [message, setMessage] = useState("Job Submitted!");

  const login_token = useSelector((state) => state.loginReducer);
  const classes = useStyles();

  const [target_col, setTarget] = useState("");
  const [data, setData] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    response: "",
    post: "",
    responseToPost: "",
    jobName: "",
    jobTime: 5,
    guest: login_token.guest,
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
              {!isPremium &&
                computeTimes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}

              {isPremium &&
                computeTimesPremium.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </TextField>
            <Button
              color="primary"
              style={{ float: "right" }}
              onClick={() => {
                setTab(4);
              }}
              variant="outlined"
            >
              Want a more customizeed job? contact us!
            </Button>
          </div>
        );
      case 1:
        return (
          <div>
            {/* <p> Upload your Dataset</p> */}
            <UploadButtons
              changeTarget={(t_col) => setTarget(t_col)}
              changeData={(fData) => setData(fData)}
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
    setLoading(true);

    if (values.jobName === "") {
      setOpenSnackBar(true);
      setSnackBarContent({
        content: "Please enter a name for this job",
        severity: "error",
      });
    } else if (activeStep === steps.length - 2 && data == null) {
      setOpenSnackBar(true);
      setSnackBarContent({
        content: "Please upload Training data",
        severity: "error",
      });
    } else if (activeStep === steps.length - 2 && target_col == "") {
      setOpenSnackBar(true);
      setSnackBarContent({
        content: "Please select Target column",
        severity: "error",
      });
    } else if (activeStep === steps.length - 1) {
      setOpenSnackBar(false);
      handleFinish();
    } else {
      setOpenSnackBar(false);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleFinish = async () => {
    setSubmitting(true);
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

    setSubmitting(false);
    if (response.status === 201 || response.status === 200) {
      console.log("submitted new job");

      setOpenSnackBar(true);
      setMessage("Job Submitted!");
      setSnackBarContent({
        content: "Submitted new job for TRAINING",
        severity: "success",
      });
      setLoading(false);
      setValues({
        response: "",
        post: "",
        responseToPost: "",
        jobName: "",
        jobTime: 5,
        guest: login_token.guest,
      });
      handleClose();
    } else {
      setOpenSnackBar(true);
      setMessage("Could not Submit Job");
      setSnackBarContent({
        content: "Something went wrong. Please try again",
        severity: "error",
      });
      setLoading(false);
    }
    setData(null);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    console.log(target_col);
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
            {loading && <CircularProgress size={34} />}
            {!loading && (
              <Typography className={classes.instructions}>
                <h1>{message}</h1>
              </Typography>
            )}
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={submitting}
              >
                {activeStep === steps.length - 1 && "Submit"}
                {activeStep !== steps.length - 1 && "Next"}
                {submitting && <CircularProgress size={25} />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

AddStepper.propTypes = {
  changeTarget: PropTypes.func,
  changeData: PropTypes.func,
};

export default AddStepper;
