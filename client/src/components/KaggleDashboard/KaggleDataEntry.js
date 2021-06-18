import React from "react";
import { ListItem } from "@material-ui/core";
import PropTypes from "prop-types";
import { NavigateNext } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import { select_datafile, cache_file } from "../../redux/actions/actions";

const KaggleDataEntry = (props) => {
  let selected_data = useSelector((state) => state.kaggleReducer.dataFile);

  let dispatch = useDispatch();
  KaggleDataEntry.propTypes = {
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  };

  const handleSelect = (idx = props.id, type = props.type) => {
    if (
      !selected_data ||
      !(selected_data.index === idx && selected_data.mode === type)
    ) {
      dispatch(select_datafile({ index: idx, mode: type }));
    } else {
      dispatch(select_datafile(null));
      dispatch(cache_file(null));
    }
  };

  return (
    <ListItem
      button
      onClick={() => handleSelect()}
      selected={
        selected_data &&
        selected_data.index === props.id &&
        selected_data.mode === props.type
      }
    >
      {props.text} <NavigateNext />
    </ListItem>
  );
};

export default KaggleDataEntry;
