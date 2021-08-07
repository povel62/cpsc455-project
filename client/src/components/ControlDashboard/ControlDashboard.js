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
import TablePagination from "@material-ui/core/TablePagination";
import ReactJoyride, { EVENTS } from "react-joyride";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import DemoRow from "./DemoRow";
import steps from "./demoSteps";

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
  iskaggle
) => {
  return {
    id,
    name,
    status,
    jobType,
    iskaggle,
    extra: [{ date: jobDate, t_col: t_col, computeTime: computeTime }],
  };
};

ControlDashboard.propTypes = {
  joyride: PropTypes.shape({
    callback: PropTypes.func,
  }),
};

ControlDashboard.defaultProps = {
  joyride: {},
};

export default function ControlDashboard(props) {
  const [run, setRun] = useState(false);

  const handleClickStart = (e) => {
    e.preventDefault();
    setRun(true);
  };

  const handleJoyrideCallback = (data) => {
    const { joyride } = props;
    const { type } = data;

    if (type === EVENTS.TOUR_END && run) {
      setRun(false);
    }

    if (type === EVENTS.TARGET_NOT_FOUND && run) {
      setRun(false);
    }

    if (typeof joyride.callback === "function") {
      joyride.callback(data);
    } else {
      console.group(type);
      console.log(data); //eslint-disable-line no-console
      console.groupEnd();
    }
  };

  const dispatch = useDispatch();

  const axios = require("axios");
  const classes = useStyles();
  let rows = [];

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const login_token = useSelector((state) => state.loginReducer);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        entry.kaggleSrc
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
    const timer = setInterval(() => {
      loadJobs();
    }, 60000); // refreshes the jobs every minute

    return () => {
      clearInterval(timer);
    };
  }, []);

  loadJobs();
  return (
    <div className="controlDashboard">
      <div className={classes.root}>
        <ReactJoyride
          continuous
          scrollToFirstStep
          showProgress
          showSkipButton
          run={run}
          steps={steps}
          styles={{
            options: {
              arrowColor: "#e3ffeb",
              // primaryColor: "#2196f3",
              zIndex: 1000,
            },
          }}
          callback={handleJoyrideCallback}
        />
        <Paper className={classes.paper}>
          <Button onClick={handleClickStart} color="primary" variant="outlined">
            Take a tour of this dashboard
          </Button>
          <TableContainer className="table" component={Paper}>
            <Table stickyHeader aria-label="jobs table">
              <TableHead className={classes.table_head}>
                <TableRow>
                  <TableCell />
                  <TableCell>
                    <strong>Job Name</strong>
                  </TableCell>
                  <TableCell />
                  <TableCell align="center">
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Type</strong>
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell align="center" className="demo__2">
                    {/* JobModal contains add job button */}
                    <JobModal refreshJobs={() => loadJobs()} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .reverse()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <Row key={index} row={row} refreshJobs={() => loadJobs()} />
                  ))}
                {run && <DemoRow />}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            // className="demo__5"
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
