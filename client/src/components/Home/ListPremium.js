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
import GradeTwoToneIcon from "@material-ui/icons/GradeTwoTone";

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

const ListPremium = () => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="h4" className={classes.title}>
        <br />
        <GradeTwoToneIcon style={{ fontSize: 20 }} />
        <AccountCircle style={{ fontSize: 30 }} />
        <br />
        Premium User
      </Typography>
      <div className={classes.demo}>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon style={{ color: "green" }} />
            </ListItemIcon>
            <ListItemText primary="Submit any number of training jobs" />
          </ListItem>
          <Divider />
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
            <ListItemText primary="Download any of the previous prediction result file" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon style={{ color: "green" }} />
            </ListItemIcon>
            <ListItemText primary="Delete a job" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon style={{ color: "green" }} />
            </ListItemIcon>
            <ListItemText primary="Use AutoML for Kaggle competitions with Tabular Data" />
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon style={{ color: "green" }} />
            </ListItemIcon>
            <ListItemText primary="Job Progress Bar" />
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon style={{ color: "green" }} />
            </ListItemIcon>
            <ListItemText primary="View job search and error logs" />
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon style={{ color: "green" }} />
            </ListItemIcon>
            <ListItemText primary="Add collaborators to a job" />
          </ListItem>
        </List>
      </div>
    </>
  );
};

export default ListPremium;
