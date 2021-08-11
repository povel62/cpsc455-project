import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 400,
    marginLeft: 65,
  },
  demo: {
    backgroundColor: "#DFE4E9",
  },
  title: {
    margin: [4, 2, 2],
  },
}));

const ListRegular = () => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="h4" className={classes.title}>
        <br />
        <AccountCircle style={{ fontSize: 30 }} />
        <br />
        Regular User
      </Typography>
      <div className={classes.demo}>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon style={{ color: "green" }} />
            </ListItemIcon>
            <ListItemText primary="Submit upto 10 training jobs" />
          </ListItem>
          <Divider />{" "}
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon style={{ color: "green" }} />
            </ListItemIcon>
            <ListItemText primary="Submit any number of  prediction test files" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon style={{ color: "green" }} />
            </ListItemIcon>
            <ListItemText primary="Download only the latest prediction result file" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon style={{ color: "green" }} />
            </ListItemIcon>
            <ListItemText primary="Delete a job" />
          </ListItem>
        </List>
      </div>
    </>
  );
};

export default ListRegular;
