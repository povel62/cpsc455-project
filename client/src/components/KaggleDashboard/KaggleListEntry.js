import React from "react";
import { ListItem } from "@material-ui/core";
import PropTypes from "prop-types";
import { NavigateNext } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  select_source,
  cache_files,
  select_datafile,
  set_loading,
} from "../../redux/actions/actions";
import axios from "axios";
import { credentials, kaggleBaseUrl, dataType } from "./kaggleApi";

const KaggleListEntry = (props) => {
  let email = useSelector((state) => state.loginReducer.email);
  let selected_source = useSelector((state) => state.kaggleReducer.source);
  let datasets = useSelector((state) => state.kaggleReducer.datasets);
  let competitions = useSelector((state) => state.kaggleReducer.competitions);
  let loading = useSelector((state) => state.kaggleReducer.loading);

  let dispatch = useDispatch();
  KaggleListEntry.propTypes = {
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  };

  const handleSelect = (idx = props.id, type = props.type) => {
    dispatch(set_loading(true));
    dispatch(select_datafile(null));
    if (
      !selected_source ||
      !(selected_source.index === idx && selected_source.mode === type)
    ) {
      dispatch(select_source({ index: idx, mode: type }));
      const mid =
        type === dataType ? "/datasets/list/" : "/competitions/data/list/";
      const end = type === dataType ? datasets[idx].ref : competitions[idx].ref;
      axios
        .get(kaggleBaseUrl + mid + end, { auth: credentials(email) })
        .then((res) => {
          if (res.status === 200) {
            dispatch(cache_files({ type: type, data: res.data }));
            dispatch(set_loading(false));
          }
        })
        .catch((err) => {
          console.log(kaggleBaseUrl + mid + end);
          console.log(err);
        });
      return;
    } else {
      dispatch(select_source({ index: -1, mode: "" }));
      dispatch(cache_files(null));
      dispatch(set_loading(false));
    }
  };

  return (
    <ListItem
      button
      onClick={() => handleSelect()}
      selected={
        !loading &&
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
