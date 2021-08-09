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

export const set_checked = (s) => {
  return {
    type: "SET_CHECKED",
    payload: s,
  };
};

export const add_checked = (s) => {
  return {
    type: "ADD_CHECKED",
    payload: s,
  };
};

export const remove_checked = (s) => {
  return {
    type: "REMOVE_CHECKED",
    payload: s,
  };
};

export const setJobs = (s) => {
  return {
    type: "SET_JOBS",
    payload: s,
  };
};

export const setKJobs = (s) => {
  return {
    type: "SET_KJOBS",
    payload: s,
  };
};

export const setKaggleSuccess = (s) => {
  return {
    type: "SET_KSUCCESS",
    payload: s,
  };
};

export const setSourceAdditionalInfo = (s) => {
  return {
    type: "SET_SRCINFO",
    payload: s,
  };
};

export const setSubTable = (s) => {
  return {
    type: "SET_SUBTABLEOPEN",
    payload: s,
  };
};

export const setPremium = (s) => {
  return {
    type: "SET_PREMIUM",
    payload: s,
  };
};

export const setGuest = (s) => {
  return {
    type: "SET_GUEST",
    payload: s,
  };
};
