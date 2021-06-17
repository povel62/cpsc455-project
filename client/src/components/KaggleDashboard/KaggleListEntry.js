import React from "react";
import { ListItem } from "@material-ui/core";
import PropTypes from "prop-types";
import { NavigateNext } from "@material-ui/icons";

const KaggleListEntry = (props) => {
  KaggleListEntry.propTypes = {
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    handleSelect: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired,
    selected: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
  };

  return (
    <ListItem
      button
      onClick={() => props.handleSelect(props.id, props.type)}
      selected={props.selected === props.id && props.mode === props.type}
    >
      {props.text} <NavigateNext />
    </ListItem>
  );
};

export default KaggleListEntry;
