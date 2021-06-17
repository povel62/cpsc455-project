import { React, useState } from "react";
import { useSelector } from "react-redux";
import { compType, dataType } from "./kaggleApi";
import { List, ListItem } from "@material-ui/core";
import KaggleListEntry from "./KaggleListEntry";

const KaggleDataPane = () => {
  let files = useSelector((state) => state.kaggleReducer.files);
  let Formatted = null;
  const [selected, setSelected] = useState(-1);
  const [mode, setMode] = useState("");

  const handleSelect = (idx, type) => {
    if (selected === idx && mode === type) {
      setSelected(-1);
      setMode("");
    } else {
      setSelected(idx);
      setMode(type);
    }
  };

  const handleIncommingFiles = (files) => {
    if (files.type === dataType) {
      return handleDatasetFiles(files.data.datasetFiles);
    } else if (files.type === compType) {
      return handleCompetitionFiles(files.data);
    }
  };

  //   <ListItem button onClick={(e) => console.log(e)} selected={false} id={i}>
  //           {entry.name}
  //         </ListItem>

  const handleDatasetFiles = (data) => {
    let entries = [];
    for (let [i, entry] of data.entries()) {
      entries.push(
        <KaggleListEntry
          key={i}
          id={i}
          text={entry.name}
          handleSelect={handleSelect}
          mode={mode}
          selected={selected}
          type={dataType}
        />
      );
    }
    return entries;
  };

  const handleCompetitionFiles = (data) => {
    // todo format into list entry
    // todo format into folder structure
    let entries = [];
    for (let [i, entry] of data.entries()) {
      entries.push(
        <ListItem
          button
          onClick={(e) => console.log(e)}
          selected={false}
          id={i}
        >
          {entry.name}
        </ListItem>
      );
    }
    return entries;
  };

  if (files) {
    Formatted = (
      <List
        onClickAway={() => {
          setMode("");
          setSelected(-1);
        }}
      >
        {handleIncommingFiles(files)}
      </List>
    );
  }

  return (
    <div className="KagglePanel">
      <h4>Supported Data Files:</h4>
      {Formatted}
    </div>
  );
};

export default KaggleDataPane;
