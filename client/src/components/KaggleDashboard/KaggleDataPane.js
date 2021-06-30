import { React } from "react";
import { useSelector } from "react-redux";
import { dataType } from "./kaggleApi";
import { Paper } from "@material-ui/core";
import TreeView from "@material-ui/lab/TreeView";
import KaggleDataEntry from "./KaggleDataEntry";
import TreeItem from "@material-ui/lab/TreeItem";
import { NavigateNext } from "@material-ui/icons";

const KaggleDataPane = () => {
  let files = useSelector((state) => state.kaggleReducer.files);
  let Formatted = null;

  if (files) {
    Formatted = (
      <TreeView className="KaggleList">{handleFiles(files)}</TreeView>
    );
  }

  return (
    <Paper>
      <div className="KagglePanel">
        <h4>Supported Data Files:</h4>
        {Formatted}
      </div>
    </Paper>
  );
};

class Node {
  constructor(text, idx) {
    this.text = text;
    this.idx = idx;
    this.fileId = -1;
    this.children = [];
  }
}

// method is partially based off Patt-tom McDonnell's work: https://github.com/pthm/node-path-list-to-tree#readme
const buildTree = (path, root, i, id) => {
  if (path.length === 0) {
    return i;
  }
  let text = path.shift();
  let idx = root.findIndex((node) => {
    return node.text === text;
  });
  if (idx < 0) {
    let n = new Node(text, i++);
    root.push(n);
    if (path.length !== 0) {
      i = buildTree(path, root[root.length - 1].children, i, id);
    } else {
      n.fileId = id;
    }
  } else {
    i = buildTree(path, root[idx].children, i, id);
  }
  return i;
};

const traverseTree = (ele, type) => {
  if (ele.children.length === 0) {
    return (
      <KaggleDataEntry
        key={ele.idx}
        id={ele.fileId}
        text={ele.text}
        type={type}
        treeid={ele.idx}
      />
    );
  } else {
    return (
      <TreeItem
        key={ele.idx}
        nodeId={ele.idx}
        label={ele.text}
        icon={<NavigateNext />}
      >
        {ele.children.map((e) => traverseTree(e, type))}
      </TreeItem>
    );
  }
};

const handleFiles = (files) => {
  let data = files.type === dataType ? files.data.datasetFiles : files.data;
  let entries = [];
  let root = [];
  let type = files.type;
  let i = 0;
  for (let [id, entry] of data.entries()) {
    let path = entry.ref.split("/");
    i = buildTree(path, root, i, id);
  }
  entries = root.map((ele) => traverseTree(ele, type));
  return entries;
};

export default KaggleDataPane;
