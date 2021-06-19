import { React, useState } from "react";
import { ExpandLess, ExpandMore, Search } from "@material-ui/icons";
import {
  List,
  ListItem,
  Collapse,
  Divider,
  InputBase,
  IconButton,
  Button,
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
} from "../../redux/actions/actions";
import KaggleListEntry from "./KaggleListEntry";
import axios from "axios";
import { credentials, kaggleBaseUrl, dataType, compType } from "./kaggleApi";
import "./KaggleDashboard.css";

const KaggleSearchPane = () => {
  const [showDatasets, setShowDatasets] = useState(false);
  const [showCompetitions, setshowCompetitions] = useState(false);
  const [fetched, setFetched] = useState(false);

  let dispatch = useDispatch();
  let userFilter = useSelector((state) => state.kaggleReducer.userFilter);
  let datasets = useSelector((state) => state.kaggleReducer.datasets);
  let competitions = useSelector((state) => state.kaggleReducer.competitions);

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
    dispatch(set_loading(true));
    if (!config) {
      config = {
        compFilter: userFilter ? userFilter.compFilter : "general",
        dataFilter: userFilter ? userFilter.dataFilter : "public",
      };
    }
    let compConfig = {
      auth: credentials,
      params: { group: config.compFilter },
    };

    let dataConfig = {
      auth: credentials,
      params: { group: config.dataFilter },
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
      dispatch(set_loading(null));
    });
  };

  const handleSearch = (e) => {
    console.log(e.target.value);
    // TODO prefix case insensative search
  };

  const handleKaggleCompSelect = async (e) => {
    e.stopPropagation();
    dispatch(
      set_userFilter({
        dataFilter: userFilter ? userFilter.dataFilter : "public",
        compFilter: e.target.value,
      })
    );

    GetKaggle({
      dataFilter: userFilter ? userFilter.dataFilter : "public",
      compFilter: e.target.value,
    });
  };

  const handleKaggleDataSelect = (e) => {
    e.stopPropagation();
    dispatch(
      set_userFilter({
        compFilter: userFilter ? userFilter.compFilter : "general",
        dataFilter: e.target.value,
      })
    );
    setFetched(false);
    GetKaggle({
      compFilter: userFilter ? userFilter.compFilter : "general",
      dataFilter: e.target.value,
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
        <h4>Kaggle competition and dataset sources:</h4>
        <List className="KaggleList" aria-labelledby="nested-list-subheader">
          <div className="searchArea">
            <InputBase
              className="serarchText"
              placeholder="Search Kaggle"
              inputProps={{ "aria-label": "search kaggle box" }}
              onChange={handleSearch}
            />
            <IconButton type="button" className="searchBtn" aria-label="search">
              <Search />
            </IconButton>
            <Button
              onClick={() => GetKaggle()}
              variant="contained"
              color="default"
            >
              Refresh
            </Button>
          </div>
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
