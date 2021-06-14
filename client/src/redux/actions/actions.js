export const has_login_token = (s) => {
  return {
    type: "SET_LOGIN_TOKEN",
    payload: s,
  };
};
