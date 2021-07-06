let request = require("request");
let { PythonShell } = require("python-shell");
const kaggleBaseUrl = "https://www.kaggle.com/api/v1";
const User = require("../models/user-model");
const Job = require("../models/job-model");
const fs = require("fs");
const unzip = require("unzip-stream");
const etl = require("etl");
const { CSV_FILES, HOSTNAME } = require("../GlobalConstants");
const jobCtrl = require("./job-ctrl");
const crypto = require("crypto");
const { Readable } = require("stream");

checkAccount = async (req, res) => {
  // TODO remove most likely, clientside can do the check
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
  // TODO
  return res.status(501).json({ success: false, error: `Not Implemented` });
};

datasetCreateVersion = async (req, res) => {
  // TODO
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
  await kaggleFileGetter(req, res, uploadTestFile);
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

// very similar to job ctrl but downloads the file from kaggle first and may optimize the pipeline for big files later
uploadJob = async (req, res) => {
  await kaggleFileGetter(req, res, uploadJobHelper);
};

function uploadJobHelper(fileData, req, res) {
  const body = req.body;
  let newJob = body;
  newJob.users = [req.params.id];
  let job = new Job(newJob);
  job.headers = fileData.split("\n")[0].split(",");
  if (!job) {
    return res.status(400).json({ success: false });
  }
  job.trainingStartedAt = new Date().getTime();
  job.status = jobCtrl.JobStatus.TRAINING;
  job
    .save()
    .then(() => {
      jobCtrl.addJobToUser(req.params.id, job).then(() => {
        uploadFileToServer(job._id, fileData, "train.csv")
          .then((s1) => {
            jobCtrl
              .runPhase(
                CSV_FILES + "/" + job._id + "/" + "train.csv",
                job._id,
                job.durationLimit,
                job.targetColumnName,
                "povel62@yahoo.ca",
                job.name,
                HOSTNAME +
                  `job/${job._id}/status/${jobCtrl.JobStatus.TRAINING_COMPLETED}`,
                true
              )
              .then((s2) => {
                return res.status(201).json({
                  success: true,
                  id: job._id,
                  message: "Job created!\n" + s1 + "\n" + s2,
                });
              });
          })
          .catch((err) => console.log(err));
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Job not created!",
      });
    });
}

function uploadTestFile(tmpFileData, req, res) {
  // TODO test this
  let headers = tmpFileData.split("\n")[0].split(",");

  Job.findOne({ _id: req.params.id }, (err, job) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "Job not found!",
      });
    }
    let fileData = "";
    if (headers.includes(job.targetColumnName)) {
      fileData = tmpFileData;
    } else {
      let csvLinesArr = tmpFileData.split("\n");
      csvLinesArr.forEach((x, index) => {
        if (index === 0) {
          fileData += x + `,${job.targetColumnName}\n`;
        } else if (index === csvLinesArr.length - 1) {
          // do nothing
        } else {
          fileData += x + ",\n";
        }
      });
      headers = fileData.split("\n")[0].split(",");
    }
    if (headers.length !== job.headers.length) {
      return res.status(400).json({
        success: false,
        message: "Job headers count is different from test file headers count!",
      });
    }

    job.predictionStartedAt = new Date().getTime();
    job.status = jobCtrl.JobStatus.PREDICTING;
    job
      .save()
      .then(() => {
        let id = crypto.randomBytes(10).toString("hex");
        uploadFileToServer(job._id, fileData, id + ".csv").then((s1) => {
          jobCtrl
            .runPhase(
              CSV_FILES + "/" + job._id + "/" + id + ".csv",
              job._id,
              job.durationLimit,
              job.targetColumnName,
              "povel62@yahoo.ca",
              job.name,
              HOSTNAME +
                `job/${job._id}/status/${jobCtrl.JobStatus.PREDICTING_COMPLETED}`,
              false
            )
            .then((s2) => {
              return res.status(201).json({
                success: true,
                id: job._id,
                message: "Job updated!\n" + s1 + "\n" + s2,
              });
            });
        });
      })
      .catch((error) => {
        return res.status(404).json({
          error,
          message: "Job not updated!",
        });
      });
  });
}

// https://stackoverflow.com/questions/36288375/how-to-parse-csv-data-that-contains-newlines-in-field-using-javascript
CSVToArray = (CSV_string, delimiter) => {
  delimiter = delimiter || ","; // user-supplied delimeter or default comma

  var pattern = new RegExp( // regular expression to parse the CSV values. // Delimiters:
    "(\\" +
      delimiter +
      "|\\r?\\n|\\r|^)" +
      // Quoted fields.
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      // Standard fields.
      '([^"\\' +
      delimiter +
      "\\r\\n]*))",
    "gi"
  );

  var rows = [[]]; // array to hold our data. First row is column headers.
  // array to hold our individual pattern matching groups:
  var matches = false; // false if we don't find any matches
  // Loop until we no longer find a regular expression match
  while ((matches = pattern.exec(CSV_string))) {
    var matched_delimiter = matches[1]; // Get the matched delimiter
    // Check if the delimiter has a length (and is not the start of string)
    // and if it matches field delimiter. If not, it is a row delimiter.
    if (matched_delimiter.length && matched_delimiter !== delimiter) {
      // Since this is a new row of data, add an empty row to the array.
      rows.push([]);
    }
    var matched_value;
    // Once we have eliminated the delimiter, check to see
    // what kind of value was captured (quoted or unquoted):
    if (matches[2]) {
      // found quoted value. unescape any double quotes.
      matched_value = matches[2].replace(new RegExp('""', "g"), '"');
    } else {
      // found a non-quoted value
      matched_value = matches[3];
    }
    // Now that we have our value string, let's add
    // it to the data array.
    rows[rows.length - 1].push(matched_value);
  }
  return rows; // Return the parsed data Array
};

function uploadFileToServer(id, fileData, fileName) {
  return new Promise((resolve, reject) => {
    try {
      let path = `./util/${id}-${fileName}`;
      fs.writeFileSync(path, fileData);

      let options = {
        args: [path, id, fileName],
      };

      PythonShell.run(
        "./util/run_upload_new.py",
        options,
        function (err, results1) {
          if (err) {
            if (err != null) {
              resolve(err);
            }
          }
          fs.unlinkSync(path);
          resolve(results1);
        }
      );
    } catch (e) {
      fs.unlinkSync(path);
      reject(e);
    }
  });
}

async function kaggleFileGetter(req, res, callback) {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide data!",
    });
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
      const url = kaggleBaseUrl + body.kaggleSrc;
      let payload = "";
      const fileName = body.kaggleSrc.split("/").pop();
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
          response.pipe(unzip.Parse()).on("entry", function (entry) {
            // modifiable to stream data if infrastructure supports it
            if (entry.path === fileName) {
              entry
                .on("data", function (d) {
                  payload += d.toString();
                })
                .on("close", function () {
                  callback(payload, req, res);
                });
            }
            entry.autodrain();
          });
        } else if (
          response.statusCode === 200 &&
          response.headers["content-type"] !== "application/zip" // TODO change to more strict type
        ) {
          response // modifiable to stream data if infrastructure supports it
            .on("data", function (d) {
              payload += d;
            })
            .on("close", function () {
              callback(payload, req, res);
            });
        } else {
          res.status(500).json({ success: false, error: "File unreadable" });
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error });
    }
  }).catch((err) => res.status(500).json({ success: false, error: err }));
}

module.exports = {
  checkAccount,
  competitionUploadSubmit,
  datasetCreateVersion,
  getKaggleFile,
  validateKaggleJob,
  createKagglePrediction,
  getCompColumns,
  uploadJob,
};
