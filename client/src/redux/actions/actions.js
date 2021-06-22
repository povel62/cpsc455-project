export const setLoginToken = (s) => {
  return {
    type: "SET_LOGIN_TOKEN",
    payload: s,
  };
};

export const setFName = (s) => {
  return {
    type: "SET_FNAME",
    payload: s,
  };
};

export const setEmail = (s) => {
  return {
    type: "SET_EMAIL",
    payload: s,
  };
};
