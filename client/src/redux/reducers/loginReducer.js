const loginReducer = (state = "", action) => {
  if (action.type == "SET_LOGIN_TOKEN") {
    return action.payload;
  } else {
    return state;
  }
};

// To extract loginReducer
//const login_token = useSelector((state) => state.loginReducer);

export default loginReducer;
