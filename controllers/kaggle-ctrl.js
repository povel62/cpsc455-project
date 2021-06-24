let { axios } = require("axios");
let { PythonShell } = require("python-shell");

checkAccount = async (req, res) => {
  // TODO do a vanilla comp list and check for unauthorized or not
  let test = new PythonShell("../util/kaggleWrapper.py", {
    env: { KAGGLE_USERNAME: "test", KAGGLE_KEY: "abcd" },
  });
  test.on("message", function (message) {
    console.log(message);
    return res.status(501).json({ success: false, error: message });
  });
};

competitionUploadSubmit = async (req, res) => {
  return res.status(501).json({ success: false, error: `Not Implemented` });
};

datasetCreateVersion = async (req, res) => {
  return res.status(501).json({ success: false, error: `Not Implemented` });
};

createKaggleJob = async (req, res) => {
  let body = req.body;
  console.log(body);
  return res.status(501).json({ success: false, error: `Not Implemented` });
};

createKagglePrediction = async (req, res) => {
  let body = req.body;
  console.log(body);
  return res.status(501).json({ success: false, error: `Not Implemented` });
};

getKaggleFile = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ success: false, error: `Bad Request` });
  }

  await User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: `User not found` });
    }
    try {
      const auth = { username: user.kusername, password: user.kapi };
      const url = req.params.url;
      // TODO fix download redirect
      axios
        .get(url, {
          responseType: "blob",
          auth: auth,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((response) => {
          res.download(response);
          return res.status(200).json({ success: true, data: user });
        });
    } catch (error) {
      return res.status(400).json({ success: false, error: error });
    }
  }).catch((err) => res.status(500).json({ success: false, error: err }));
};

module.exports = {
  checkAccount,
  competitionUploadSubmit,
  datasetCreateVersion,
  getKaggleFile,
  createKaggleJob,
  createKagglePrediction,
};
