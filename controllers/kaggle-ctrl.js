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
} = require("./generic-ctrl");

// "/kaggle/:id/:jid/competitions/:ref/submit/:name"
competitionUploadSubmit = async (req, res) => {
  if (!req.params.ref) {
    return res
      .status(400)
      .json({ success: false, message: "you need a kaggle ref to submit!" });
  }
  Job.findOne({ _id: req.params.jid }, (err, job) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "Job not found!",
      });
    }
    let path = `./util/${req.params.name}`;
    let cols = [];
    let message = "Generated with Ensemble Squared: A Meta AutoML System"; // TODO
    // console.log(req.body);
    if (req.body.params.cols) {
      try {
        cols = JSON.parse(req.body.params.cols);
      } catch (e) {
        cols = req.body.params.cols;
      }
    }
    // return res.status(501).json({ success: false, error: `Not Implemented` });
    // TODO change to _id after token verify
    User.findOne({ _id: req.params.id }, (err, user) => {
      if (err) {
        return res.status(404).json({
          err,
          message: "User not found!",
        });
      }
      getPredFileText(job._id, req.params.name, path, cols)
        .then((s1) => {
          // path, msg, ref
          let options = {
            args: [path, message, req.params.ref],
            env: {
              KAGGLE_USERNAME: user.kusername,
              KAGGLE_KEY: user.kapi,
            },
          };
          new Promise((resolve, reject) => {
            try {
              PythonShell.run(
                "./util/submit_comp.py",
                options,
                function (err, results) {
                  if (err) {
                    if (err != null) {
                      console.log(err);
                      reject(err);
                    }
                  }
                  console.log(results);
                  resolve(results);
                }
              );
            } catch (err) {
              console.log(err);
              reject("error running python code'");
            }
          })
            .then(
              () => {
                res.status(201).json({ success: true });
              },
              () => {
                // rejected by kaggle (99% chance unauth), TODO change exitcode to http code in python
                res.status(401).json({ success: false });
              }
            )
            .catch((err) => {
              res.status(500).json({ success: false });
            })
            .finally(() => {
              try {
                fs.unlinkSync(path);
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
  if (!req.body || !req.body.params.title || !req.body.params.cols) {
    return res.status(400).json({ success: false });
  }
  let title = req.body.params.title.replace(/[^a-z0-9]/gi, "") + "-prediction";
  // TODO check title is bewteen 6-50 characters long, '-' allowed but not '_'
  // TODO allow license change?
  Job.findOne({ _id: req.params.jid }, (err, job) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "Job not found!",
      });
    }
    let folder = fs.mkdtempSync("./util/");
    let path = `${folder}/${req.params.name}`;
    // let folder = `./util/${prefix}`;
    // if (!fs.existsSync(folder)) {
    //   fs.mkdirSync(folder);
    // }
    let cols = [];
    if (req.body.params.cols) {
      try {
        cols = JSON.parse(req.body.params.cols);
      } catch (e) {
        cols = req.body.params.cols;
      }
    }
    // TODO change to _id after token verify
    User.findOne({ _id: req.params.id }, (err, user) => {
      if (err) {
        return res.status(404).json({
          err,
          message: "User not found!",
        });
      }
      getPredFileText(job._id, req.params.name, path, cols)
        .then((s1) => {
          // TODO write config json
          let config = {
            title: title,
            id: `${user.kusername}/${title}`,
            licenses: [{ name: "unknown" }],
          };
          config = JSON.stringify(config);
          fs.writeFileSync(folder + `/dataset-metadata.json`, config);
          // TODO remove
          // return res
          //   .status(501)
          //   .json({ success: false, error: `Not Implemented` });

          let options = {
            args: [folder],
            env: {
              KAGGLE_USERNAME: user.kusername,
              KAGGLE_KEY: user.kapi,
            },
          };
          new Promise((resolve, reject) => {
            try {
              PythonShell.run(
                "./util/submit_dataset.py",
                options,
                function (err, results) {
                  if (err) {
                    if (err != null) {
                      console.log(err);
                      reject(err);
                    }
                  }
                  console.log(results);
                  resolve(results);
                }
              );
            } catch (err) {
              console.log(err);
              reject("error running python code'");
            }
          })
            .then(
              () => {
                res.status(201).json({ success: true });
              },
              () => {
                // rejected by kaggle (99% chance unauth), TODO change exitcode to http code in python
                res.status(401).json({ success: false });
              }
            )
            .catch((err) => {
              res.status(500).json({ success: false });
            })
            .finally(() => {
              try {
                console.log("here")
                // fs.rmSync()
                fs.rmSync(folder,{ recursive: true });
                // fs.unlinkSync(path);
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

  // config api: https://github.com/Kaggle/kaggle-api/wiki/Dataset-Metadata
  // TODO write config json to folder as dataset-metadata.json
  // return res.status(501).json({ success: false, error: `Not Implemented` });
};

validateKaggleJob = async (req, res, next) => {
  let body = req.body;
  if (!body.kaggleId || !body.kaggleType || !body.kaggleSrc) {
    return res.status(400).json({ success: false, error: `Bad Request` });
  }
  next();
};

createKagglePrediction = async (req, res) => {
  // TODO check job status
  // jobCtrl.JobStatus.PREDICTING
  // jobCtrl.JobStatus.PREDICTING_COMPLETED
  // jobCtrl.JobStatus.TRAINING_COMPLETED
  console.log(req.body);

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
      jobCtrl.addJobToUser(req.params.id, job).then(() => {
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
                `job/${job._id}/status/${jobCtrl.JobStatus.TRAINING_COMPLETED}`,
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
              `job/${job._id}/status/${jobCtrl.JobStatus.PREDICTING_COMPLETED}`,
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
  competitionUploadSubmit,
  datasetCreateVersion,
  getKaggleFile,
  validateKaggleJob,
  createKagglePrediction,
  getCompColumns,
  uploadJob,
};
