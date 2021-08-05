import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    maxHeight: "35vh",
    maxWidth: "20vw",
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
  },
}));

export default function CheckboxList(props) {
  const classes = useStyles();
  CheckboxList.propTypes = {
    cols: PropTypes.array.isRequired,
    checked: PropTypes.array.isRequired,
    setChecked: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
  };
  const { cols, checked, setChecked, submitting } = props;

  // based off source: https://material-ui.com/components/lists/
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  return (
    <List className={classes.root}>
      {cols.map((value, i) => {
        const labelId = `checkbox-list-label-${value}`;
        return (
          <ListItem
            key={i}
            dense
            button
            disabled={submitting}
            onClick={handleToggle(i)}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(i) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={value} />
          </ListItem>
        );
      })}
    </List>
  );
}
