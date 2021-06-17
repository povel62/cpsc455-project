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
  }
  return newState;
};

export default kaggleReducer;
