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
  setSourceAdditionalInfo,
} from "../../redux/actions/actions";
import axios from "axios";
import {
  credentials,
  kaggleBaseUrl,
  dataType,
  getDatasetView,
} from "./kaggleApi";
import { makeStyles } from "@material-ui/core/styles";

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

  const useStyles = makeStyles((theme) => ({
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }));

  const classes = useStyles();

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
      credentials(email).then((auth) => {
        axios
          .get(kaggleBaseUrl + mid + end, { auth: auth })
          .then((res) => {
            if (res.status === 200) {
              dispatch(cache_files({ type: type, data: res.data }));
              if (type === dataType) {
                getDatasetView(
                  auth,
                  type === dataType ? datasets[idx].ref : competitions[idx].ref
                )
                  .then((res) => {
                    dispatch(setSourceAdditionalInfo(res));
                  })
                  .catch(() => {
                    dispatch(setSourceAdditionalInfo(res));
                  })
                  .finally(() => {
                    dispatch(set_loading(false));
                  });
              } else {
                dispatch(set_loading(false));
                dispatch(setSourceAdditionalInfo(null));
              }
            }
          })
          .catch((err) => {
            console.log(kaggleBaseUrl + mid + end);
            console.log(err);
            dispatch(set_loading(false));
          });
      });
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
      disabled={loading}
      selected={
        !loading &&
        selected_source &&
        selected_source.index === props.id &&
        selected_source.mode === props.type
      }
      className={classes.nested}
    >
      {props.text} <NavigateNext />
    </ListItem>
  );
};

export default KaggleListEntry;
