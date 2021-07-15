import React from "react";
//import React, { useState } from "react";
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
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import { useSelector } from "react-redux";
import JobModal from "../../JobModal/JobModal";
import RefreshIcon from "@material-ui/icons/Refresh";
import IconButton from "@material-ui/core/IconButton";
import { useEffect } from "react";

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

const rows = [
  createData(
    "Job 1",
    "In-progress",
    "Tabular",
    "2022-51-95",
    "ABCD-1189",
    "25 minutes",
    "hello"
  ),
  createData(
    "TestMLJob",
    "Completed",
    "Tabular",
    "999-99-99",
    "CDF-892G",
    "6 minutes",
    "bye bye"
  ),
];

export default function ControlDashboard() {
  //const axios = require("axios");
  const classes = useStyles();

  const login_token = useSelector((state) => state.loginReducer);

  async function loadJobs() {
    const response = await fetch("/api/user/jobs", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + login_token.accessToken,
      },
    });

    if (response.status === 201 || response.status === 200) {
      console.log(response);
      alert("success");
    } else {
      //resetValues();
      console.log("error");
      alert(response.status);
    }

    //setState(!state);

    // axios
    //   .get("/api/user/jobs", {
    //     headers: {
    //       Authorization: "Bearer " + login_token.accessToken,
    //     },
    //   })
    //   .then(console.log("success"))
    //   .catch((error) => {
    //     console.log("error");
    //     console.error(error);
    //   });
  }

  useEffect(() => {
    loadJobs();
  }, []);

  //loadJobs();
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
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>
              {/* <button onClick={add_handler}> Add Job </button> */}
              <JobModal />
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
                    {rows.map((row) => (
                      <Row key={row.name} row={row} />
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
