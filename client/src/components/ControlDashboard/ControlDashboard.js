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
import JobModal from "../JobModal/JobModal";
import { useSelector, useDispatch } from "react-redux";
import { setJobs } from "../../redux/actions/actions";
import Tooltip from "@material-ui/core/Tooltip";
import RefreshIcon from "@material-ui/icons/Refresh";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    width: "90vw",
    color: theme.palette.text.secondary,
  },
}));

const createData = (
  name,
  status,
  jobType,
  jobDate,
  t_col,
  computeTime,
  alertText
) => {
  return {
    name,
    status,
    jobType,
    alertText,
    extra: [{ date: jobDate, t_col: t_col, computeTime: computeTime }],
  };
};

export default function ControlDashboard() {
  const dispatch = useDispatch();

  const axios = require("axios");
  const classes = useStyles();
  let rows = [];

  const login_token = useSelector((state) => state.loginReducer);
  if (login_token.jobs) {
    rows = login_token.jobs.map((entry) =>
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
  }

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
        <Paper className={classes.paper}>
          <TableContainer className="table" component={Paper}>
            <Table stickyHeader aria-label="jobs table">
              <TableHead className={classes.table_head}>
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
                  <TableCell align="center">
                    {/* JobModal contains add job button */}
                    <JobModal refreshJobs={() => loadJobs()} />
                  </TableCell>
                  <TableCell align="center">
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
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.reverse().map((row, index) => (
                  <Row key={index} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
}
