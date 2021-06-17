export const has_login_token = (s) => {
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
