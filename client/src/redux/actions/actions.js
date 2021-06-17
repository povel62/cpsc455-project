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
