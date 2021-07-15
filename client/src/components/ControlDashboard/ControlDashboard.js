import React, { useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "./ControlDashboard.css";
import Row from "./Row.js";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import JobModal from "../JobModal/JobModal";
import { useSelector, useDispatch } from "react-redux";
import { setJobs } from "../../redux/actions/actions";
import Tooltip from "@material-ui/core/Tooltip";
import RefreshIcon from "@material-ui/icons/Refresh";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const createData = (
  name,
  status,
  jobType,
  jobDate,
  jobHash,
  computeTime,
  alertText
) => {
  return {
    name,
    status,
    jobType,
    alertText,
    extra: [{ date: jobDate, jobHash: jobHash, computeTime: computeTime }],
  };
};

export default function ControlDashboard() {
  const dispatch = useDispatch();

  const axios = require("axios");
  const classes = useStyles();

  const login_token = useSelector((state) => state.loginReducer);

  let rows = login_token.jobs.map((entry) =>
    createData(
      entry.name,
      entry.status,
      "Tabular",
      entry.createdAt,
      entry.targetColumnName,
      entry.durationLimit,
      "hello"
    )
  );

  async function loadJobs() {
    axios
      .get(`/api/user/jobs`, {
        headers: {
          Authorization: "Bearer " + login_token.accessToken,
        },
      })
      .then((response) => {
        if (response.status === 201 || response.status === 200) {
          let jobData = response.data.data;
          if (jobData) {
            console.log("success get jobs");
            dispatch(setJobs(jobData));
          }
        } else {
          console.log("error");
          alert(response.status);
        }
      });
  }

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="controlDashboard">
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <h1>CONTROL DASHBOARD</h1>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>
              <Tooltip title="Refresh" aria-label="Refresh">
                <IconButton
                  size="large"
                  color="primary"
                  aria-label="Refresh jobs"
                  onClick={() => loadJobs()}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>
              {/* JobModal contains add job button */}
              <JobModal refreshJobs={() => loadJobs()} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <TableContainer className="table" component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>
                        <strong>Job Name</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Type</strong>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <Row key={index} row={row} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
