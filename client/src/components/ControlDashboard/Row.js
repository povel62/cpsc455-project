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
import useRowStyles from "./rowStyles.js";

const Row = (props) => {
  const shareEvent = () => alert(row.alertText);

  const { row } = props;

  const [open, setOpen] = React.useState(false);

  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
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
        <TableCell>
          <button onClick={shareEvent}>Share</button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="jobs">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Job Hash</TableCell>
                    <TableCell align="center">Compute Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.extra.map((extraRow) => (
                    <TableRow key={extraRow.date}>
                      <TableCell component="th" scope="row">
                        {extraRow.date}
                      </TableCell>
                      <TableCell>{extraRow.jobHash}</TableCell>
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
        jobHash: PropTypes.string.isRequired,
        computeTime: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Row;
