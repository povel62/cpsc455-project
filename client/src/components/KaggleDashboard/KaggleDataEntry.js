import React from "react";
import { ListItem } from "@material-ui/core";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { select_datafile, cache_file } from "../../redux/actions/actions";
import { NavigateNext } from "@material-ui/icons";

const KaggleDataEntry = (props) => {
  let selected_data = useSelector((state) => state.kaggleReducer.dataFile);
  let loading = useSelector((state) => state.kaggleReducer.loading);
  let dispatch = useDispatch();
  KaggleDataEntry.propTypes = {
    id: PropTypes.number.isRequired,
    treeid: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  };

  const acceptableFileType = (text) => {
    let arr = text.split(".");
    if (arr.length === 0) {
      return false;
    } else {
      let res = arr[arr.length - 1].toLowerCase() === "csv" ? true : false;
      return res;
    }
  };

  const handleSelect = (
    idx = props.id,
    type = props.type,
    text = props.text
  ) => {
    if (!selected_data || !(selected_data.index === idx)) {
      dispatch(
        select_datafile({
          index: idx,
          mode: type,
          text: text,
          accepted: acceptableFileType(text),
        })
      );
    } else {
      dispatch(select_datafile(null));
      dispatch(cache_file(null));
    }
  };

  return (
    <ListItem
      button
      disabled={loading}
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
