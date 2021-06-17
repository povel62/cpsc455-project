import { React, useState } from "react";
import { ExpandLess, ExpandMore, Search } from "@material-ui/icons";
import {
  List,
  ListSubheader,
  ListItem,
  Collapse,
  Divider,
  InputBase,
  IconButton,
  Button,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  cache_competitions,
  cache_datasets,
  cache_files,
} from "../../redux/actions/actions";
import KaggleListEntry from "./KaggleListEntry";
import axios from "axios";
import { credentials, kaggleBaseUrl, dataType, compType } from "./kaggleApi";

const KaggleSearchPane = () => {
  const [showDatasets, setShowDatasets] = useState(false);
  const [showCompetitions, setshowCompetitions] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [fetched, setFetched] = useState(false);
  const [mode, setMode] = useState("");

  let dispatch = useDispatch();

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

  const handleSelect = (idx, type) => {
    if (selected === idx && mode === type) {
      setSelected(-1);
      setMode("");
      dispatch(cache_files(null));
    } else {
      setSelected(idx);
      setMode(type);
      const mid =
        type === dataType ? "/datasets/list/" : "/competitions/data/list/";
      const end = type === dataType ? datasets[idx].ref : competitions[idx].id;
      console.log(kaggleBaseUrl + mid + end);
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
          // TODO dataset and competition formatted
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

  const handleSearch = (e) => {
    console.log(e.target.value);
    // TODO prefix case insensative search
  };

  if (datasets) {
    for (let [i, entry] of datasets.entries()) {
      datasetEntries.push(
        <KaggleListEntry
          key={i}
          id={i}
          text={entry.title}
          handleSelect={handleSelect}
          mode={mode}
          selected={selected}
          type={dataType}
        />
      );
    }
  }

  if (competitions) {
    for (let [i, entry] of competitions.entries()) {
      competitionEntries.push(
        <KaggleListEntry
          key={i}
          id={i}
          text={entry.title}
          handleSelect={handleSelect}
          mode={mode}
          selected={selected}
          type={compType}
        />
      );
    }
  }

  return (
    <div className="KagglePanel">
      <Button
        onClick={() => HandleRefresh()}
        variant="contained"
        color="default"
      >
        Refresh
      </Button>
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
      </div>
      <List
        style={{ maxHeight: "100%", overflow: "auto" }}
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
            <List>{datasetEntries}</List>
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
            <List>{competitionEntries}</List>
          </div>
        </Collapse>
      </List>
    </div>
  );
};

export default KaggleSearchPane;
