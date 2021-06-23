import React from "react";
import { Redirect, Route } from "react-router";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const AuthRoute = (props) => {
  const login_token = useSelector((state) => state.loginReducer.accessToken);
  const isAuthUser =
    login_token !== undefined && login_token !== null && login_token !== "";
  const { type } = props;
  if (type === "guest" && isAuthUser) return <Redirect to="/home" />;
  else if (type === "private" && !isAuthUser) return <Redirect to="/" />;

  return <Route {...props} />;
};

AuthRoute.propTypes = {
  isAuthUser: PropTypes.string,
  type: PropTypes.string,
};

export default AuthRoute;
