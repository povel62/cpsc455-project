const { default: axios } = require("axios");
const dataType = "DATA";
const compType = "COMPETITION";
const kaggleBaseUrl = "https://www.kaggle.com/api/v1";
const credentials = (email) => {
  // TODO reject to unauthorized instead of blank
  if (!email) {
    return new Promise((resolve) => {
      resolve({
        username: "",
        password: "",
      });
    });
  }
  return new Promise((resolve) => {
    axios
      .get("/api/user", { params: { email: email } })
      .then((res) => {
        if (res.status === 200) {
          if (!res.data.data.kusername || !res.data.data.kapi) {
            resolve({ username: "", password: "" });
          }
          resolve({
            username: res.data.data.kusername,
            password: res.data.data.kapi,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        resolve({
          username: "",
          password: "",
        });
      });
  });
};

const competitionAuth = (ref, email) => {
  return new Promise((resolve) => {
    credentials(email).then((auth) => {
      axios
        .get(kaggleBaseUrl + `/competitions/submissions/list/${ref}`, {
          auth: auth,
        })
        .then((res) => {
          if (res.status === 200) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(() => {
          resolve(false);
        });
    });
  });
};

const KaggleAuthCheck = (email) => {
  return new Promise((resolve) => {
    credentials(email).then((auth) => {
      axios
        .get(kaggleBaseUrl + `/competitions/list`, { auth: auth })
        .then((res) => {
          if (res.status === 200) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(() => {
          resolve(false);
        });
    });
  });
};

module.exports = {
  dataType: dataType,
  compType: compType,
  kaggleBaseUrl: kaggleBaseUrl,
  credentials: credentials,
  competitionAuth: competitionAuth,
  KaggleAuthCheck: KaggleAuthCheck,
};
