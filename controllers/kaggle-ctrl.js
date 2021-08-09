let request = require("request");
let { PythonShell } = require("python-shell");
const kaggleBaseUrl = "https://www.kaggle.com/api/v1";
const User = require("../models/user-model");
const Job = require("../models/job-model");
const unzip = require("unzip-stream");
const etl = require("etl");
const { CSV_FILES, HOSTNAME } = require("../GlobalConstants");
const jobCtrl = require("./job-ctrl");
const crypto = require("crypto");
const fs = require("fs");
const {
  uploadFileToServer,
  runPhase,
  getPredFileText,
  checkJobUsers,
} = require("./generic-ctrl");

competitionUploadSubmit = async (req, res) => {
  if (
    !req.params.ref ||
    !req.body ||
    !req.body.params.title ||
    !req.body.params.cols
  ) {
    return res
      .status(400)
      .json({ success: false, message: "you need a kaggle ref to submit!" });
  }
  let title = req.body.params.title.replace(/[^a-z0-9]/gi, "");
  if (title.length > 50) {
    title = title.substring(50);
  }
  Job.findOne({ _id: req.params.jid }, (err, job) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "Job not found!",
      });
    }
    if (checkJobUsers(job, req._id) === false) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    let folder = fs.mkdtempSync("./util/");
    let path = `${folder}/${req.params.name}`;
    let cols = [];
    let message = "Generated with Ensemble Squared: A Meta AutoML System";
    if (req.body.params.cols) {
      try {
        cols = JSON.parse(req.body.params.cols);
      } catch (e) {
        cols = req.body.params.cols;
      }
    }
    User.findOne({ _id: req._id }, (err, user) => {
      if (err) {
        return res.status(404).json({
          err,
          message: "User not found!",
        });
      }
      getPredFileText(job._id, req.params.name, path, cols)
        // eslint-disable-next-line no-unused-vars
        .then((s1) => {
          // rename file and update path according to title
          let newPath = folder + "/" + title;
          fs.renameSync(path, newPath);
          path = newPath;
          let options = {
            args: [path, message, req.params.ref],
            env: {
              KAGGLE_USERNAME: user.kusername,
              KAGGLE_KEY: user.kapi,
              ...process.env,
            },
          };
          new Promise((resolve, reject) => {
            try {
              PythonShell.run(
                "./util/submit_comp.py",
                options,
                function (err, results) {
                  if (err) {
                    reject(err);
                  }
                  resolve(results);
                }
              );
            } catch (err) {
              reject(`error running python code ${err}`);
            }
          })
            .then(
              () => {
                res.status(201).json({ success: true });
              },
              (err) => {
                // rejected by kaggle (99% chance unauth), TODO change exitcode to http code in python
                res.status(401).json({ success: false, error: err });
              }
            )
            .catch((err) => {
              res.status(500).json({ success: false, error: err });
            })
            .finally(() => {
              try {
                fs.rmSync(folder, { recursive: true });
              } catch (e) {
                console.log(e);
              }
            });
        })
        .catch((error) => {
          return res.status(404).json({
            error,
            message: "Cannot find file!",
          });
        });
    });
  });
};

datasetCreateVersion = async (req, res) => {
  // config api: https://github.com/Kaggle/kaggle-api/wiki/Dataset-Metadata
  if (!req.body || !req.body.params.title || !req.body.params.cols) {
    return res.status(400).json({ success: false });
  }
  // alphanumeric only, 6-50 chars long
  let title = req.body.params.title.replace(/[^a-z0-9]/gi, "");
  if (title.length > 50) {
    title = title.substring(50);
  }
  Job.findOne({ _id: req.params.jid }, (err, job) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "Job not found!",
      });
    }
    if (checkJobUsers(job, req._id) === false) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    let folder = fs.mkdtempSync("./util/");
    let path = `${folder}/${req.params.name}`;
    let cols = [];
    if (req.body.params.cols) {
      try {
        cols = JSON.parse(req.body.params.cols);
      } catch (e) {
        cols = req.body.params.cols;
      }
    }
    User.findOne({ _id: req._id }, (err, user) => {
      if (err) {
        return res.status(404).json({
          err,
          message: "User not found!",
        });
      }
      getPredFileText(job._id, req.params.name, path, cols)
        // eslint-disable-next-line no-unused-vars
        .then((s1) => {
          let config = {
            title: title,
            id: `${user.kusername}/${title}`,
            licenses: [{ name: "unknown" }],
          };
          config = JSON.stringify(config);
          fs.writeFileSync(folder + `/dataset-metadata.json`, config);
          let options = {
            args: [folder],
            env: {
              KAGGLE_USERNAME: user.kusername,
              KAGGLE_KEY: user.kapi,
              ...process.env,
            },
          };
          new Promise((resolve, reject) => {
            try {
              PythonShell.run(
                "./util/submit_dataset.py",
                options,
                function (err, results) {
                  if (err) {
                    reject(err);
                  }
                  resolve(results);
                }
              );
            } catch (err) {
              reject(`error running python code ${err}`);
            }
          })
            .then(
              () => {
                res.status(201).json({ success: true });
              },
              (err) => {
                // rejected by kaggle (99% chance unauth), TODO change exitcode to http code in python
                res.status(401).json({ success: false, error: err });
              }
            )
            .catch((err) => {
              res.status(500).json({ success: false, error: err });
            })
            .finally(() => {
              try {
                fs.rmSync(folder, { recursive: true });
              } catch (e) {
                console.log(e);
              }
            });
        })
        .catch((error) => {
          return res.status(404).json({
            error,
            message: "Cannot find file!",
          });
        });
    });
  });
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

  await User.findOne({ _id: req._id }, (err, user) => {
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
      ).pipe(res);
    } catch (error) {
      return res.status(400).json({ success: false, error: error });
    }
  }).catch((err) => res.status(500).json({ success: false, error: err }));
};

getCompColumns = async (req, res) => {
  if (!req.query.url) {
    return res.status(400).json({ success: false, error: `Bad Request` });
  }

  await User.findOne({ _id: req._id }, (err, user) => {
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
            console.log("error: " + response.statusCode);
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

uploadJob = async (req, res) => {
  await kaggleFileGetter(req, res, uploadJobHelper);
};

function uploadJobHelper(fileData, req, res) {
  const body = req.body;
  let newJob = body;
  newJob.users = [req._id];
  let job = new Job(newJob);
  job.headers = fileData
    .split("\n")[0]
    .split(",")
    .map((x) => x.replace("\r", ""));

  if (!job) {
    return res.status(400).json({ success: false });
  }
  job.trainingStartedAt = new Date().getTime();
  job.status = jobCtrl.JobStatus.TRAINING;
  job
    .save()
    .then(() => {
      jobCtrl.addJobToUser(req._id, job).then(() => {
        uploadFileToServer(job._id, fileData, "train.csv")
          .then((s1) => {
            runPhase(
              CSV_FILES + "/" + job._id + "/" + "train.csv",
              job._id,
              job.durationLimit,
              job.targetColumnName,
              "povel62@yahoo.ca",
              job.name,
              HOSTNAME +
                `job/${job._id}/status/${jobCtrl.JobStatus.TRAINING_COMPLETED}?key=` +
                encrypt(process.env.API_SECRET_TEXT),
              true
            ).then((s2) => {
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
  let headers = tmpFileData
    .split("\n")[0]
    .split(",")
    .map((x) => x.replace("\r", ""));

  Job.findOne({ _id: req.body.job }, (err, job) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "Job not found!",
      });
    }
    if (checkJobUsers(job, req._id) === false) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    let fileData = "";
    if (headers.includes(job.targetColumnName)) {
      fileData = tmpFileData;
    } else {
      let csvLinesArr = tmpFileData.split("\n");
      csvLinesArr.forEach((x, index) => {
        if (index === 0) {
          fileData += x.replace("\r", "") + `,${job.targetColumnName}\n`;
        } else if (index === csvLinesArr.length - 1) {
          // do nothing
        } else {
          fileData += x.replace("\r", "") + ",\n";
        }
      });
      headers = fileData
        .split("\n")[0]
        .split(",")
        .map((x) => x.replace("\r", ""));
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
          runPhase(
            CSV_FILES + "/" + job._id + "/" + id + ".csv",
            job._id,
            job.durationLimit,
            job.targetColumnName,
            "povel62@yahoo.ca",
            job.name,
            HOSTNAME +
              `job/${job._id}/status/${jobCtrl.JobStatus.PREDICTING_COMPLETED}?key=` +
              encrypt(process.env.API_SECRET_TEXT),
            false
          ).then((s2) => {
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

async function kaggleFileGetter(req, res, callback) {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide data!",
    });
  }
  await User.findOne({ _id: req._id }, (err, user) => {
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
          response.headers["content-type"] !== "application/zip"
        ) {
          response
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
  competitionUploadSubmit,
  datasetCreateVersion,
  getKaggleFile,
  validateKaggleJob,
  createKagglePrediction,
  getCompColumns,
  uploadJob,
};
