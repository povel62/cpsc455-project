export const setLoginToken = (s) => {
  return {
    type: "SET_LOGIN_TOKEN",
    payload: s,
  };
};

export const getKaggleCredentials = (s) => {
  return {
    type: "GET_CREDENTIALS",
    payload: s,
  };
};
export const setFName = (s) => {
  return {
    type: "SET_FNAME",
    payload: s,
  };
};

export const setLName = (s) => {
  return {
    type: "SET_LNAME",
    payload: s,
  };
};

export const setKaggleUsername = (s) => {
  return {
    type: "SET_KUSERNAME",
    payload: s,
  };
};

export const setKaggleAPI = (s) => {
  return {
    type: "SET_KAPI",
    payload: s,
  };
};

export const cache_competitions = (s) => {
  return {
    type: "CACHE_COMPETITIONS",
    payload: s,
  };
};

export const cache_datasets = (s) => {
  return {
    type: "CACHE_DATASETS",
    payload: s,
  };
};

export const cache_files = (s) => {
  return {
    type: "CACHE_FILES",
    payload: s,
  };
};

export const cache_file = (s) => {
  return {
    type: "CACHE_FILE",
    payload: s,
  };
};

export const select_source = (s) => {
  return {
    type: "SELECT_SOURCE",
    payload: s,
  };
};

export const select_datafile = (s) => {
  return {
    type: "SELECT_DATAFILE",
    payload: s,
  };
};

export const set_loading = (s) => {
  return {
    type: "SET_LOADING",
    payload: s,
  };
};

export const set_userFilter = (s) => {
  return {
    type: "SET_USERFILTER",
    payload: s,
  };
};

export const setEmail = (s) => {
  return {
    type: "SET_EMAIL",
    payload: s,
  };
};
