let request = require("request");
let { PythonShell } = require("python-shell");
const kaggleBaseUrl = "https://www.kaggle.com/api/v1";
const User = require("../models/user-model");
const fs = require("fs");
const unzip = require("unzip-stream");
const etl = require("etl");

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

getCompColumns = async (req, res) => {
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
      ).on("response", function (response) {
        if (
          response.statusCode === 200 &&
          response.headers["content-type"] === "application/zip"
        ) {
          return response.pipe(unzip.Parse()).on("entry", function (entry) {
            let csv = entry.pipe(etl.csv());
            csv
              .pipe(etl.prescan(5, (d) => fetchColumns(d, csv, res)))
              .on("error", function (e) {
                res.status(500).json({ success: false, error: e });
              });
          });
        } else if (response.statusCode === 200) {
          let csv = response.pipe(etl.csv());
          csv
            .pipe(etl.prescan(5, (d) => fetchColumns(d, csv, res)))
            .on("error", function (e) {
              res.status(500).json({ success: false, error: e });
            });
        } else {
          res
            .status(500)
            .json({ success: false, error: "File columns unreadable" });
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error });
    }
  }).catch((err) => res.status(500).json({ success: false, error: err }));
};

function fetchColumns(d, csv, res) {
  let columns = new Set();
  d.forEach((d) => Object.keys(d).forEach((key) => columns.add(key)));
  csv.destroy();
  columns.delete("__line");
  return res.status(200).json({ success: true, data: Array.from(columns) });
}

module.exports = {
  checkAccount,
  competitionUploadSubmit,
  datasetCreateVersion,
  getKaggleFile,
  validateKaggleJob,
  createKagglePrediction,
  getCompColumns,
};
