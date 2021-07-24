import React from "react";
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
import Button from "@material-ui/core/Button";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Tooltip from "@material-ui/core/Tooltip";
import ProgressBar from "./ProgressBar";
import ShareModal from "../ShareModal/ShareModal";
import { useSelector } from "react-redux";
import ErrorModal from "../ErrorModal";


const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

const Row = ({ row, refreshJobs }) => {
  const login_token = useSelector((state) => state.loginReducer);

  const predictEvent = () => alert("predict");

  const deleteJobEvent = async () => {
    const response = await fetch("api/job/" + row.id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + login_token.accessToken,
      },
    });
    if (response.status === 201 || response.status === 200) {
      alert(response.status);
    } else {
      console.log(response.data);
      alert(response.status);
    }
 
    refreshJobs();
  };
  
  // const seeJobErrorEvent = () => alert("checkout job error/output");

  const [open, setOpen] = React.useState(false);

  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root} hover="true">
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
        <TableCell align="center">{row.status}</TableCell>
        <TableCell align="center">{row.jobType}</TableCell>
        <TableCell align="center">
          <Tooltip title="predit job" aria-label="click to start predicting">
            <Button
              variant="contained"
              // color="secondary"
              component="span"
              onClick={predictEvent}
              endIcon={<DonutLargeIcon />}
            >
              Predict
            </Button>
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
          <ProgressBar status={row.status} />
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
    alertText: PropTypes.string.isRequired,

    extra: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        t_col: PropTypes.string.isRequired,
        computeTime: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Row;
