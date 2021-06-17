import {
  Grid,
  List,
  ListSubheader,
  ListItem,
  Collapse,
  Divider,
  InputBase,
  IconButton,
  Button,
} from "@material-ui/core";
import {
  ExpandLess,
  ExpandMore,
  NavigateNext,
  Search,
} from "@material-ui/icons";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  cache_competitions,
  cache_datasets,
} from "../../redux/actions/actions";
import "./KaggleDashboard.css";

// TODO REFACTOR TO SMALLER COMPONENTS

const KaggleDashBoard = () => {
  const [showDatasets, setShowDatasets] = useState(false);
  const [showCompetitions, setshowCompetitions] = useState(false);
  const [selected, setSelected] = useState(0);
  const [fetched, setFetched] = useState(false);
  const [mode, setMode] = useState("DATA");
  const dataType = "DATA";
  const compType = "COMPETITION";
  const kaggleBaseUrl = "https://www.kaggle.com/api/v1";
  const credentials = {
    username: "aidanfrost",
    password: "e49286214ff5309afce3f318f0eb0538",
  };
  let dispatch = useDispatch();

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

  const handleSelect = (idx, type) => {
    if (selected === idx && mode === type) {
      setSelected(-1);
      setMode("");
    } else {
      setSelected(idx);
      setMode(type);
    }
  };

  const GetKaggle = () => {
    // TODO limit to user's collections for now
    // TOOD error handling

    // get competitions
    let comps = axios
      .get(kaggleBaseUrl + "/competitions/list", {
        auth: credentials,
      })
      .then((res) => {
        if (res.status === 200) {
          dispatch(cache_competitions(res.data));
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //
    // get datasets
    let datasets = axios
      .get(kaggleBaseUrl + "/datasets/list", {
        auth: credentials,
      })
      .then((res) => {
        if (res.status === 200) {
          dispatch(cache_datasets(res.data));
        }
      })
      .catch((err) => {
        console.log(err);
      });

    Promise.all([comps, datasets]).then(() => {
      setFetched(true);
    });
  };

  const HandleRefresh = () => {
    GetKaggle();
  };

  return (
    <div className="KaggleDash">
      <Grid container spaceing={3}>
        <Grid item xs>
          <div className="KaggleTargetViewer">
            <Button onClick={() => HandleRefresh()}>Refresh</Button>
            <div className="searchArea">
              <InputBase
                className="serarchText"
                placeholder="Search Kaggle"
                inputProps={{ "aria-label": "search kaggle box" }}
              />
              <IconButton
                type="button"
                className="searchBtn"
                aria-label="search"
              >
                <Search />
              </IconButton>
            </div>
            <List
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Kaggle competitions and dataset sources
                </ListSubheader>
              }
            >
              <ListItem button onClick={handleDatasetClick}>
                Personal Datasets
                {showDatasets ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={showDatasets} timeout="auto" unmountOnExit>
                <div className="datasetList">
                  <List>
                    <ListItem
                      button
                      onClick={() => handleSelect(1, dataType)}
                      selected={selected === 1 && mode === dataType}
                    >
                      Covid Dataset <NavigateNext />
                    </ListItem>
                  </List>
                </div>
              </Collapse>
              <Divider />
              <ListItem
                button
                onClick={handleCompetitionClick}
                className="nestedItem"
              >
                Competitions
                {showCompetitions ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={showCompetitions} timeout="auto" unmountOnExit>
                <div className="competitionList">
                  <List>
                    <ListItem
                      button
                      onClick={() => handleSelect(1, compType)}
                      selected={selected === 1 && mode === compType}
                    >
                      Card drivng Dataset <NavigateNext />
                    </ListItem>
                  </List>
                </div>
              </Collapse>
            </List>
          </div>
        </Grid>
        <Grid item xs>
          <h1>Dataset selector from competition OR competition browser</h1>
          {/* TODO put a standard list if selected is not -1, get list of data from redux */}
        </Grid>
        <Grid item xs>
          <h1>Uploader/Downloader/Dispatch to job</h1>
          {/* TODO a widget with buttons to do actions with datasets from kaggle to do ops from notepad */}
        </Grid>
      </Grid>
    </div>
  );
};

export default KaggleDashBoard;
