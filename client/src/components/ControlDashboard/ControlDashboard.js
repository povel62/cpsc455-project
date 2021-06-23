import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "./ControlDashboard.css";
import Row from "./Row.js";

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
  return (
    <div className="controlDashboard">
      <button> Refresh </button>
      <TableContainer className="table" component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>
                {" "}
                <strong>Job Name</strong>
              </TableCell>
              <TableCell align="center">
                {" "}
                <strong>Status</strong>
              </TableCell>
              <TableCell align="center">
                {" "}
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
    </div>
  );
}
