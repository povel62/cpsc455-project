const kaggleReducer = (state = {}, action) => {
  let newState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case "GET_CREDENTIALS":
      newState.kapi = action.payload;
      break;
    case "CACHE_COMPETITIONS":
      newState.competitions = action.payload;
      break;
    case "CACHE_DATASETS":
      newState.datasets = action.payload;
      break;
    case "CACHE_FILES":
      newState.files = action.payload;
      break;
    case "CACHE_FILE":
      newState.file = action.payload;
      break;
    case "SELECT_SOURCE":
      newState.source = action.payload;
      break;
    case "SELECT_DATAFILE":
      newState.dataFile = action.payload;
      break;
    case "SET_LOADING":
      newState.loading = action.payload;
      break;
    case "SET_USERFILTER":
      newState.userFilter = action.payload;
  }
  return newState;
};

export default kaggleReducer;
