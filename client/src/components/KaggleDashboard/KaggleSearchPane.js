import { React, useState } from "react";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import {
  List,
  ListItem,
  Collapse,
  Divider,
  Paper,
  Select,
  MenuItem,
  Grid,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  cache_competitions,
  cache_datasets,
  set_loading,
  set_userFilter,
  select_source,
  select_datafile,
  cache_files,
} from "../../redux/actions/actions";
import KaggleListEntry from "./KaggleListEntry";
import axios from "axios";
import { credentials, kaggleBaseUrl, dataType, compType } from "./kaggleApi";
import "./KaggleDashboard.css";
import KaggleSearchForm from "./KaggleSearchForm";

const KaggleSearchPane = () => {
  const [showDatasets, setShowDatasets] = useState(false);
  const [showCompetitions, setshowCompetitions] = useState(false);
  const [fetched, setFetched] = useState(false);

  let dispatch = useDispatch();
  let userFilter = useSelector((state) => state.kaggleReducer.userFilter);
  let datasets = useSelector((state) => state.kaggleReducer.datasets);
  let competitions = useSelector((state) => state.kaggleReducer.competitions);
  let token = useSelector((state) => state.loginReducer.accessToken);
  let loading = useSelector((state) => state.kaggleReducer.loading);

  let datasetEntries = [];
  let competitionEntries = [];

  const handleDatasetClick = () => {
    if (showDatasets === false && fetched === false) {
      GetKaggle();
    }
    setShowDatasets(!showDatasets);
  };

  const handleCompetitionClick = () => {
    if (showCompetitions === false && fetched === false) {
      GetKaggle();
    }
    setshowCompetitions(!showCompetitions);
  };

  const GetKaggle = (config) => {
    setFetched(false);
    dispatch(select_source({ index: -1, mode: "" }));
    dispatch(set_loading(true));
    dispatch(select_datafile(null));
    dispatch(cache_files(null));
    if (!config) {
      config = {
        compFilter: userFilter ? userFilter.compFilter : "general",
        dataFilter: userFilter ? userFilter.dataFilter : "public",
        searchTerm: userFilter ? userFilter.searchTerm : "",
      };
    }
    credentials(token).then((auth) => {
      let compConfig = {
        auth: auth,
        params: { group: config.compFilter, search: config.searchTerm },
      };

      let dataConfig = {
        auth: auth,
        params: { group: config.dataFilter, search: config.searchTerm },
      };

      let comps = axios
        .get(kaggleBaseUrl + "/competitions/list", compConfig)
        .then((res) => {
          if (res.status === 200) {
            dispatch(cache_competitions(res.data));
            return res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      let datasets = axios
        .get(kaggleBaseUrl + "/datasets/list", dataConfig)
        .then((res) => {
          if (res.status === 200) {
            dispatch(cache_datasets(res.data));
            return res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });

      Promise.all([comps, datasets]).then(() => {
        setFetched(true);
        dispatch(set_loading(false));
      });
    });
  };

  const handleKaggleCompSelect = async (e) => {
    e.stopPropagation();
    dispatch(
      set_userFilter({
        dataFilter: userFilter ? userFilter.dataFilter : "public",
        compFilter: e.target.value,
        searchTerm: userFilter ? userFilter.searchTerm : "",
      })
    );

    GetKaggle({
      dataFilter: userFilter ? userFilter.dataFilter : "public",
      compFilter: e.target.value,
      searchTerm: userFilter ? userFilter.searchTerm : "",
    });
  };

  const handleKaggleDataSelect = (e) => {
    e.stopPropagation();
    dispatch(
      set_userFilter({
        compFilter: userFilter ? userFilter.compFilter : "general",
        dataFilter: e.target.value,
        searchTerm: userFilter ? userFilter.searchTerm : "",
      })
    );
    setFetched(false);
    GetKaggle({
      compFilter: userFilter ? userFilter.compFilter : "general",
      dataFilter: e.target.value,
      searchTerm: userFilter ? userFilter.searchTerm : "",
    });
  };

  if (datasets) {
    for (let [i, entry] of datasets.entries()) {
      datasetEntries.push(
        <KaggleListEntry key={i} id={i} text={entry.title} type={dataType} />
      );
    }
  }

  if (competitions) {
    for (let [i, entry] of competitions.entries()) {
      competitionEntries.push(
        <KaggleListEntry key={i} id={i} text={entry.title} type={compType} />
      );
    }
  }

  return (
    <Paper>
      <div className="KagglePanel">
        <h2 className="KagglePanelHeader">
          Kaggle competition and dataset sources
        </h2>
        <List className="KaggleList" aria-labelledby="nested-list-subheader">
          <KaggleSearchForm GetKaggle={GetKaggle} />
          <ListItem
            button
            onClick={handleCompetitionClick}
            className="nestedItem"
          >
            <Grid container>
              <Grid item xs={8}>
                Competitions{" "}
              </Grid>
              <Grid item xs={4}>
                <Select
                  labelId="competition-select-label"
                  id="competition_filter"
                  value={userFilter ? userFilter.compFilter : "general"}
                  onChange={(e) => handleKaggleCompSelect(e)}
                  disabled={loading}
                >
                  <MenuItem value={"general"}>General</MenuItem>
                  <MenuItem value={"inClass"}>In Class</MenuItem>
                  <MenuItem value={"entered"}>Entered</MenuItem>
                </Select>
              </Grid>
            </Grid>
            {showCompetitions ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={showCompetitions}>
            <div className="competitionList">
              <List>{competitionEntries}</List>
            </div>
          </Collapse>
          <Divider />
          <ListItem button onClick={handleDatasetClick}>
            <Grid container>
              <Grid item xs={8}>
                Personal Datasets
              </Grid>
              <Grid item xs={4}>
                <Select
                  labelId="dataset-select-label"
                  id="dataset_filter"
                  value={userFilter ? userFilter.dataFilter : "public"}
                  onChange={handleKaggleDataSelect}
                  disabled={loading}
                >
                  <MenuItem value={"public"}>Public</MenuItem>
                  <MenuItem value={"my"}>Personal</MenuItem>
                  <MenuItem value={"myPrivate"}>Private</MenuItem>
                  <MenuItem value={"upvoted"}>Upvoted</MenuItem>
                  <MenuItem value={"user"}>User</MenuItem>
                </Select>
              </Grid>
            </Grid>
            {showDatasets ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={showDatasets}>
            <div className="datasetList">
              <List>{datasetEntries}</List>
            </div>
          </Collapse>
        </List>
      </div>
    </Paper>
  );
};

export default KaggleSearchPane;
