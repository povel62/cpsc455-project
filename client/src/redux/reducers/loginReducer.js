const loginReducer = (
  state = {
    fname: "",
    email: "",
    accessToken: "",
    lname: "",
    kusername: "",
    kapi: "",
  },
  action
) => {
  switch (action.type) {
    case "SET_LOGIN_TOKEN":
      return Object.assign({}, state, { accessToken: action.payload });
    case "SET_EMAIL":
      return Object.assign({}, state, { email: action.payload });
    case "SET_FNAME":
      return Object.assign({}, state, { fname: action.payload });
    case "SET_LNAME":
      return Object.assign({}, state, { lname: action.payload });
    case "SET_KUSERNAME":
      return Object.assign({}, state, { kusername: action.payload });
    case "SET_KAPI":
      return Object.assign({}, state, { kapi: action.payload });
    default:
      return state;
  }
};

// To extract loginReducer
//const login_token = useSelector((state) => state.loginReducer);

export default loginReducer;
