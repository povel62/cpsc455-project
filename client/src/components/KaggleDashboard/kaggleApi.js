const { default: axios } = require("axios");
const dataType = "DATA";
const compType = "COMPETITION";
const kaggleBaseUrl = "https://www.kaggle.com/api/v1";
const credentials = (email) => {
  if (!email) {
    return {
      username: "",
      password: "",
    };
  }
  axios
    .get("/api/user", { params: { email: email } })
    .then((res) => {
      if (res.status === 200) {
        if (!res.data.kusername || !res.data.kapi) {
          return null;
        }
        return { username: res.data.kusername, password: res.data.kapi };
      }
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

module.exports = {
  dataType: dataType,
  compType: compType,
  kaggleBaseUrl: kaggleBaseUrl,
  credentials: credentials,
};
