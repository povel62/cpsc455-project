import React from "react";
import { ListItem } from "@material-ui/core";
import PropTypes from "prop-types";
import { NavigateNext } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  select_source,
  cache_files,
  select_datafile,
} from "../../redux/actions/actions";
import axios from "axios";
import { credentials, kaggleBaseUrl, dataType } from "./kaggleApi";

const KaggleListEntry = (props) => {
  let selected_source = useSelector((state) => state.kaggleReducer.source);
  let datasets = useSelector((state) => state.kaggleReducer.datasets);
  let competitions = useSelector((state) => state.kaggleReducer.competitions);

  let dispatch = useDispatch();
  KaggleListEntry.propTypes = {
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  };

  const handleSelect = (idx = props.id, type = props.type) => {
    dispatch(select_datafile({ index: -1, mode: "" }));
    if (
      !selected_source ||
      !(selected_source.index === idx && selected_source.mode === type)
    ) {
      dispatch(select_source({ index: idx, mode: type }));
      const mid =
        type === dataType ? "/datasets/list/" : "/competitions/data/list/";
      const end = type === dataType ? datasets[idx].ref : competitions[idx].id;
      axios
        .get(kaggleBaseUrl + mid + end, { auth: credentials })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            dispatch(cache_files({ type: type, data: res.data }));
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    } else {
      dispatch(select_source({ index: -1, mode: "" }));
      dispatch(cache_files(null));
    }
  };

  return (
    <ListItem
      button
      onClick={() => handleSelect()}
      selected={
        selected_source &&
        selected_source.index === props.id &&
        selected_source.mode === props.type
      }
    >
      {props.text} <NavigateNext />
    </ListItem>
  );
};

export default KaggleListEntry;
