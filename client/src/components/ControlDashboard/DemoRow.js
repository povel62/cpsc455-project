import React from "react";
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
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ProgressBar from "./ProgressBar";
import AddIcon from "@material-ui/icons/Add";
import { InlineIcon } from "@iconify/react";
import kaggleIcon from "@iconify-icons/simple-icons/kaggle";
import ErrorOutlinedIcon from "@material-ui/icons/ErrorOutlined";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import Button from "@material-ui/core/Button";

const DemoRow = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow hover={true} className="demo__3">
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            className="demo__4"
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          TourJob
        </TableCell>
        <TableCell component="th" scope="row" className="demo__5">
          <InlineIcon icon={kaggleIcon} color="skyblue" height="3em" />
        </TableCell>
        <TableCell align="center" className="demo__6">
          PREDICTING_COMPLETED
        </TableCell>
        <TableCell align="center">Tabular</TableCell>
        <TableCell align="center" className="demo__7">
          <Button
            variant="contained"
            component="span"
            endIcon={<CloudDownloadIcon />}
          >
            Latest Prediction
          </Button>
          <br />
          <br />
          <Button
            variant="contained"
            component="span"
            endIcon={<DonutLargeIcon />}
          >
            Submit New Test
          </Button>
        </TableCell>
        <TableCell align="center" className="demo__8">
          <Button
            variant="contained"
            color="primary"
            component="span"
            endIcon={<AddIcon />}
          >
            Share
          </Button>
        </TableCell>
        <TableCell align="center">
          <IconButton aria-label="expand row" size="small" className="demo__9">
            <DeleteOutlineIcon color="error" />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="expand row"
            size="small"
            className="demo__10"
          >
            <ErrorOutlinedIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={8}
          className="demo__11"
        >
          <ProgressBar
            status="PREDICTING_COMPLETED"
            progressColor="secondary"
            start={100}
          />
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
                  \
                  <TableRow>
                    <TableCell component="th" scope="row">
                      2021-07-31
                    </TableCell>
                    <TableCell>Target Column</TableCell>
                    <TableCell align="center">20 minutes</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default DemoRow;
