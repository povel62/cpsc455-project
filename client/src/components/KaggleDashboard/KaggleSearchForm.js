import React, { useState } from "react";
import { Button, IconButton, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { set_userFilter } from "../../redux/actions/actions";

const KaggleSearchForm = (props) => {
  KaggleSearchForm.propTypes = {
    GetKaggle: PropTypes.func.isRequired,
  };

  let userFilter = useSelector((state) => state.kaggleReducer.userFilter);
  let [search, setSearch] = useState("");
  let dispatch = useDispatch();

  const handleSearch = (e) => {
    setSearch(e.target.value.trim());
  };

  return (
    <div className="searchArea">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          let config = {
            compFilter: userFilter ? userFilter.compFilter : "general",
            dataFilter: userFilter ? userFilter.dataFilter : "public",
            searchTerm: search,
          };
          dispatch(set_userFilter(config));
          props.GetKaggle(config);
        }}
      >
        <TextField
          className="serarchText"
          placeholder="Search Kaggle"
          inputProps={{ "aria-label": "search kaggle box" }}
          onChange={handleSearch}
        />
        <IconButton type="submit" className="searchBtn" aria-label="search">
          <Search />
        </IconButton>
        <Button type="submit" variant="contained" color="default">
          Refresh
        </Button>
      </form>
    </div>
  );
};

export default KaggleSearchForm;
