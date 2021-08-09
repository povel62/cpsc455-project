import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import "./ControlDashboard.css";
import { makeStyles } from "@material-ui/core/styles";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Tooltip from "@material-ui/core/Tooltip";
import ProgressBar from "./ProgressBar";
import ShareModal from "../ShareModal/ShareModal";
import { useSelector } from "react-redux";
import ErrorModal from "../ErrorModal";
import PredictModal from "../PredictModal/PredictModal";
import { InlineIcon } from "@iconify/react";
import kaggleIcon from "@iconify-icons/simple-icons/kaggle";
import PredictDlModal from "../PredictDownloadModal/PredictDlModal";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

const Row = ({ row, refreshJobs }) => {
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarContent, setSnackBarContent] = useState({
    content: " ",
    severity: "success",
  });

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const login_token = useSelector((state) => state.loginReducer);

  const deleteJobEvent = async () => {
    const response = await fetch("api/job/" + row.id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + login_token.accessToken,
      },
    });
    if (response.status === 201 || response.status === 200) {
      setOpenSnackBar(true);
      setSnackBarContent({
        content: "Job Deleted successfully.",
        severity: "success",
      });
    } else {
      console.log(response.data);

      setOpenSnackBar(true);
      setSnackBarContent({
        content: "Could not delete. Try again.",
        severity: "error",
      });
    }

    refreshJobs();
  };

  // const seeJobErrorEvent = () => alert("checkout job error/output");

  const [open, setOpen] = React.useState(false);

  const classes = useRowStyles();

  return (
    <React.Fragment>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={snackBarContent.severity}
        >
          {snackBarContent.content}
        </Alert>
      </Snackbar>
      <TableRow className={classes.root} hover={true}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.iskaggle && (
            <InlineIcon icon={kaggleIcon} color="skyblue" height="3em" />
          )}
        </TableCell>
        <TableCell align="center">{row.status}</TableCell>
        <TableCell align="center">{row.jobType}</TableCell>
        <TableCell align="center">
          <Tooltip title="predit job" aria-label="click to start predicting">
            <PredictModal
              refreshJobs={() => refreshJobs()}
              jobId={row.id}
              showPredict={
                row.status == "TRAINING_COMPLETED" ||
                row.status == "PREDICTING_COMPLETED" ||
                row.status == "PREDICTING"
              }
              // showDownload={
              //   row.status == "PREDICTING_COMPLETED" ||
              //   row.status == "PREDICTING"
              // }
            />
          </Tooltip>
        </TableCell>
        <TableCell align="center">
          <Tooltip
            title="download predit job"
            aria-label="click to download predicted files"
          >
            <PredictDlModal
              refreshJobs={() => refreshJobs()}
              jobId={row.id}
              showDownload={
                row.status == "PREDICTING_COMPLETED" ||
                row.status == "PREDICTING"
              }
            />
          </Tooltip>
        </TableCell>
        <TableCell align="center">
          <Tooltip
            title="Get share link for this job"
            aria-label="get link to share this job"
          >
            <ShareModal jobID={row.id}></ShareModal>
          </Tooltip>
        </TableCell>
        <TableCell align="center">
          <Tooltip title="Delete job" aria-label="Delete this job">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={deleteJobEvent}
            >
              <DeleteOutlineIcon color="error" />
            </IconButton>
          </Tooltip>
          <IconButton
            aria-label="expand row"
            size="small"
            // onClick={seeJobErrorEvent}
          >
            <ErrorModal jobId={row.id} />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          {row.status == "TRAINING" && (
            <ProgressBar status="TRAINING" progressColor="primary" start={0} />
          )}
          {row.status == "TRAINING_COMPLETED" && (
            <ProgressBar
              status="TRAINING_COMPLETED"
              progressColor="secondary"
              start={50}
            />
          )}
          {row.status == "PREDICTING" && (
            <ProgressBar
              status="PREDICTING"
              progressColor="secondary"
              start={50}
            />
          )}
          {row.status == "PREDICTING_COMPLETED" && (
            <ProgressBar
              status="PREDICTING_COMPLETED"
              progressColor="secondary"
              start={100}
            />
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="jobs">
                <TableHead>
                  <TableRow>
                    <TableCell>Creation Date</TableCell>
                    <TableCell>Target Column</TableCell>
                    <TableCell align="center">Compute Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.extra.map((extraRow) => (
                    <TableRow key={extraRow.date}>
                      <TableCell component="th" scope="row">
                        {extraRow.date.substr(0, 10)}
                      </TableCell>
                      <TableCell>{extraRow.t_col}</TableCell>
                      <TableCell align="center">
                        {extraRow.computeTime}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

Row.propTypes = {
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    jobType: PropTypes.string.isRequired,
    iskaggle: PropTypes.string.isRequired,

    extra: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        t_col: PropTypes.string.isRequired,
        computeTime: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Row;
