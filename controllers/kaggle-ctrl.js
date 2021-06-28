let request = require("request");
let { PythonShell } = require("python-shell");
const kaggleBaseUrl = "https://www.kaggle.com/api/v1";
const User = require("../models/user-model");

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

validateKaggleJob = async (req, res, next) => {
  let body = req.body;
  if (!body.kaggleId || !body.kaggleType || !body.kaggleSrc) {
    return res.status(400).json({ success: false, error: `Bad Request` });
  }
  next();
};

createKagglePrediction = async (req, res) => {
  let body = req.body;
  console.log(body);
  return res.status(501).json({ success: false, error: `Not Implemented` });
};

getKaggleFile = async (req, res) => {
  if (!req.query.url) {
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
      const url = kaggleBaseUrl + req.query.url;
      // const filename = crypto.createHash("sha256").update(url).digest("hex");
      request(
        {
          url: url,
          method: "GET",
          auth: auth,
          encoding: null,
        },
        function (error, response) {
          if (error) {
            console.error("error: " + response.statusCode);
          }
        }
      ).pipe(res);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error });
    }
  }).catch((err) => res.status(500).json({ success: false, error: err }));
};

module.exports = {
  checkAccount,
  competitionUploadSubmit,
  datasetCreateVersion,
  getKaggleFile,
  validateKaggleJob,
  createKagglePrediction,
};
