import React, { useEffect, useState } from "react";
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
import TablePagination from "@material-ui/core/TablePagination";

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
  id,
  name,
  status,
  jobType,
  jobDate,
  t_col,
  computeTime,
  kaggleID
) => {
  return {
    id,
    name,
    status,
    jobType,
    kaggleID,
    extra: [{ date: jobDate, t_col: t_col, computeTime: computeTime }],
  };
};

export default function ControlDashboard() {
  const dispatch = useDispatch();

  const axios = require("axios");
  const classes = useStyles();
  let rows = [];

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const login_token = useSelector((state) => state.loginReducer);

  // const filled_rows = Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  // const emptyRows = rowsPerPage - filled_rows;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // filled_rows = Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    // emptyRows = rowsPerPage - filled_rows;
    // console.log("empty:" + emptyRows);
    // console.log("filled length:" + filled_rows);
    // console.log("page:" + page);
    // console.log("rows pp:" + rowsPerPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    // filled_rows = Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    // emptyRows = rowsPerPage - filled_rows;
    // console.log("empty:" + emptyRows);
    // console.log("filled length:" + filled_rows);
    // console.log("page:" + page);
    // console.log("rows pp:" + rowsPerPage);
  };

  if (login_token.jobs) {
    rows = login_token.jobs.map((entry) =>
      createData(
        entry.id,
        entry.name,
        entry.status,
        "Tabular",
        entry.createdAt,
        entry.targetColumnName,
        entry.durationLimit,
        entry.kaggleID
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
            dispatch(setJobs(jobData));
          }
        } else {
          console.log("error");
          alert(response.status);
        }
      })
      .catch((err) => {
        console.log(err);
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
                        size="medium"
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
                {rows
                  .reverse()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <Row key={index} row={row} refreshJobs={() => loadJobs()} />
                  ))}
                {/* {emptyRows > 0 && (
                  <TableRow style={{ height: 55 * emptyRows }}>
                    <TableCell> {emptyRows} </TableCell>
                  </TableRow>
                )} */}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
}
