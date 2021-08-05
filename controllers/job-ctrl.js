const Job = require("../models/job-model");
const User = require("../models/user-model");
const { addJobToUser } = require("./generic-ctrl");
const ObjectId = require("mongodb").ObjectID;
let { PythonShell } = require("python-shell");
var crypto = require("crypto");
const { CSV_FILES, SESSIONS, HOSTNAME } = require("../GlobalConstants");
const {
  uploadFileToServer,
  runPhase,
  getPredFileNames,
  getPredFileText,
  getPredErrorOutputFileText,
} = require("./generic-ctrl");
const { sendTemplateEmail } = require("./send-email");
const fs = require("fs");
const csv = require("csv-parser");
const { validateGuest } = require("../util/validation");
const jwt = require("jsonwebtoken");
const { secret } = require("../util/security");

tryTest = async () => {
  let options = {
    args: ["ls"],
    env: {
      ...process.env,
    },
  };

  PythonShell.run("./util/run_test.py", options, function (err, results1) {
    if (err) {
      if (err != null) {
        return err;
      }
    }
    return results1;
  });
};

// /opt/slurm/bin/sbatch --partition=blackboxml --nodelist=chicago\
//          --error=/ubc/cs/research/plai-scratch/BlackBoxML/error.err\
//          --output=/ubc/cs/research/plai-scratch/BlackBoxML/out.out\
//          /ubc/cs/research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared/run-client-search-bm.sh\
//          "60dd54803baa72ef93306ea5" "HEHE" "/ubc/cs/research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared/datasets/60dd54803baa72ef93306ea5/train.csv" "5" "Date" "povel62@yahoo.ca" "https://cpsc455-project.herokuapp.com/apijob/60dd54803baa72ef93306ea5/status/TRAINING_COMPLETED"

// /opt/slurm/bin/sbatch --partition=blackboxml --nodelist=chicago\
//          --error=/ubc/cs/research/plai-scratch/BlackBoxML/error_predict.err\
//          --output=/ubc/cs/research/plai-scratch/BlackBoxML/out_predict.out\
//          /ubc/cs/research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared/run-client-produce.sh\
//          "60dcc25271a132cc9c05d1e2" "HEHE" "/ubc/cs/research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared/datasets/60dcc25271a132cc9c05d1e2/8f2e83efe416a93719a5.csv" "5" "Date" "povel62@yahoo.ca"

//  /opt/slurm/bin/sbatch --partition=blackboxml --nodelist=chicago\
//          --error=/ubc/cs/research/plai-scratch/BlackBoxML/error.err\
//          --output=/ubc/cs/research/plai-scratch/BlackBoxML/out.out\
//          /ubc/cs/research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared/run-client-produce.sh\
//          60dcca95c81cf5d1580c45e4 HEHE /ubc/cs/research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared/datasets/60dcca95c81cf5d1580c45e4/829036a5f48b16b37684.csv 5 Date povel62@yahoo.ca https://cpsc455-project.herokuapp.com/apijob/60dd54803baa72ef93306ea5/status/TRAINING_COMPLETED

const JobStatus = {
  CREATED: "CREATED",
  TRAINING: "TRAINING",
  TRAINING_COMPLETED: "TRAINING_COMPLETED",
  PREDICTING: "PREDICTING",
  PREDICTING_COMPLETED: "PREDICTING_COMPLETED", // or PREDICTION_COMPLETED
  ERROR: "ERROR",
};

createJob = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a job",
    });
  }
  let newJob = body;
  newJob.users = [req.params.id];
  let job = new Job(newJob);

  if (!job) {
    return res.status(400).json({ success: false, error: err });
  }
  job.status = JobStatus.CREATED;

  job
    .save()
    .then(() => {
      addJobToUser(req.params.id, job);
      return res.status(201).json({
        success: true,
        id: job._id,
        message: "Job created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Job not created!",
      });
    });
};

uploadJob = async (req, res) => {
  // console.log("request received");
  // let token = req.headers.authorization.split(" ")[1];
  // const decoded = jwt.verify(token, secret);
  // var userId = decoded._id;
  var userId = req._id;
  // console.log("user id here");
  console.log(userId);

  const body = req.body;

  console.log("body here");
  console.log(body);
  console.log(req.files);

  //console.log(req);

  if (!body) {
    console.log("error 1 no body");
    return res.status(400).json({
      success: false,
      error: "You must provide a job",
    });
  }

  console.log("request here");
  //console.log(req);

  if (!req.files) {
    console.log("error 2 no file");
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  console.log("reached here 1");

  let fileData = req.files.file.data.toString("utf8");
  let newJob = body;
  newJob.users = userId;
  let job = new Job(newJob);

  job.headers = fileData
    .split("\n")[0]
    .split(",")
    .map((x) => x.replace("\r", ""));

  if (!job) {
    return res.status(400).json({ success: false, error: err });
  }
  job.trainingStartedAt = new Date().getTime();
  job.status = JobStatus.TRAINING;

  job
    .save()
    .then(() => {
      addJobToUser(userId, job);
      uploadFileToServer(job._id, fileData, "train.csv").then((s1) => {
        runPhase(
          CSV_FILES + "/" + job._id + "/" + "train.csv",
          job._id,
          job.durationLimit,
          job.targetColumnName,
          "povel62@yahoo.ca",
          job.name,
          HOSTNAME + `job/${job._id}/status/${JobStatus.TRAINING_COMPLETED}`,
          true
        ).then((s2) => {
          return res.status(201).json({
            success: true,
            id: job._id,
            message: "Job created!\n" + s1 + "\n" + s2,
          });
        });
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Job not created!",
      });
    });
};

uploadTestFile = async (req, res) => {
  // let token = req.headers.authorization.split(" ")[1];
  // const decoded = jwt.verify(token, secret);
  // var userId = decoded._id;
  const body = req.body;

  if (!body) {
    console.log("error 1 no body");
    return res.status(400).json({
      success: false,
      error: "You must provide a body with test file",
    });
  }

  if (!req.files) {
    console.log("error 2 no file");
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }
  let tmpFileData = req.files.file.data.toString("utf8");
  let headers = tmpFileData
    .split("\n")[0]
    .split(",")
    .map((x) => x.replace("\r", ""));

  console.log(" !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111 ");
  console.log(req.params.id);

  Job.findOne({ _id: req.params.id }, (err, job) => {
    if (err) {
      console.log("job not found");
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
      console.log("error 3 header");
      return res.status(400).json({
        success: false,
        message: "Job headers count is different from test file headers count!",
      });
    }

    job.predictionStartedAt = new Date().getTime();
    job.status = JobStatus.PREDICTING;
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
              `job/${job._id}/status/${JobStatus.PREDICTING_COMPLETED}`,
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
};

getPreds = async (req, res) => {
  Job.findOne({ _id: req.params.id }, (err, job) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "Job not found!",
      });
    }
    getPredFileNames(job._id).then((s1) => {
      let fileNames = [];
      try {
        console.log(s1);
        if (s1.length > 0) {
          fileNames = JSON.parse(s1[0].replace(/'/g, '"')).map((x) => {
            return x.split("\n")[0];
          });
        }
      } catch (err) {
        console.log("cant retrieve");
        return res.status(404).json({
          error: err,
          message: "Cannot retreive files!",
        });
      }

      console.log("file name here");
      console.log(fileNames);

      return res.status(200).json({
        success: true,
        id: job._id,
        fileNames,
      });
    });
  }).catch((err) => {
    return res.status(404).json({
      error: err,
      message: "Cannot find files!",
    });
  });
};

getFileText = async (req, res) => {
  Job.findOne({ _id: req.params.id }, (err, job) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "Job not found!",
      });
    }
    //let fileName = job.trainingFinishedAt > job.predictionFinishedAt;
    let path = `./util/${req.params.id}-${req.params.fileName}`;
    getPredErrorOutputFileText(job._id, path, req.params.fileName)
      .then((s1) => {
        try {
          var array = fs.readFileSync(path).toString("utf8").split("\n");
          fs.unlinkSync(path);
          return res.status(200).json(array);
        } catch (err) {
          return res.status(404).json({
            error,
            message: "Cannot find file!",
          });
        }
      })
      .catch((error) => {
        fs.unlinkSync(path);

        return res.status(404).json({
          error,
          message: "Cannot find file!",
        });
      });
  }).catch((err) => {
    return res.status(404).json({
      error: err,
      message: "Cannot find files!",
    });
  });
};

getPredFile = async (req, res) => {
  Job.findOne({ _id: req.params.id }, (err, job) => {
    if (err) {
      console.log("job not found");
      return res.status(404).json({
        err,
        message: "Job not found!",
      });
    }
    let path = `./util/${req.params.name}`;
    let cols = [];
    if (req.query.cols) {
      try {
        // postman won't send this as json but axios does?
        cols = JSON.parse(req.query.cols);
      } catch (e) {
        cols = req.query.cols;
      }
    }

    getPredFileText(job._id, req.params.name, path, cols)
      .then((s1) => {
        let exportFile = req.query.export;
        let csvData = [];
        try {
          if (exportFile === "false") {
            fs.createReadStream(path)
              .pipe(csv())
              .on("data", (row) => {
                csvData.push(row);
              })
              .on("end", () => {
                fs.unlinkSync(path);
                return res.send(csvData);
              });
          } else {
            res.download(path, (error) => {
              fs.unlinkSync(path);
            });
          }
        } catch (err) {
          console.log(err);
        }
      })
      .catch((error) => {
        console.log("file not found");
        return res.status(404).json({
          error,
          message: "Cannot find file!",
        });
      });
  });
};

updateJob = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update",
    });
  }

  Job.findOne({ _id: req.params.id }, (err, job) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "Job not found!",
      });
    }

    if (body.durationLimit) job.durationLimit = body.durationLimit;
    if (body.targetColumnName) job.targetColumnName = body.targetColumnName;
    if (body.targetColumnIndex) job.targetColumnIndex = body.targetColumnIndex;
    if (Object.values(JobStatus).includes(body.status)) {
      if (body.status) {
        job.status = body.status;
        if (body.status === JobStatus.TRAINING)
          job.trainingStartedAt = new Date().getTime();
        if (body.status === JobStatus.PREDICTING)
          job.predictionStartedAt = new Date().getTime();
        if (body.status === JobStatus.COMPLETED)
          job.predictionFinishedAt = new Date().getTime();
      }
    }
    if (body.name) job.name = body.name;

    job
      .save()
      .then(() => {
        // TODO: According to status, submit job for training or pred (submit job code)
        return res.status(200).json({
          success: true,
          id: job._id,
          message: "Job updated!",
        });
      })
      .catch((error) => {
        return res.status(404).json({
          error,
          message: "Job not updated!",
        });
      });
  });
};

updateJobStatus = async (req, res) => {
  const body = req.body;

  Job.findOne({ _id: req.params.id }, (err, job) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "Job not found!",
      });
    }
    if (req.params.statusName) {
      if (Object.values(JobStatus).includes(req.params.statusName)) {
        job.status = req.params.statusName;
        if (req.params.statusName === JobStatus.TRAINING)
          job.trainingStartedAt = new Date().getTime();
        if (req.params.statusName === JobStatus.TRAINING_COMPLETED) {
          job.trainingFinishedAt = new Date().getTime();
          job.status = body.isSuccess ? job.status : JobStatus.ERROR;
          job.users.forEach(async (element) => {
            await User.findOne({ _id: element }, async (err, user) => {
              if (err) {
                return res.status(400).json({ success: false, error: err });
              }
              if (!user) {
                return res
                  .status(404)
                  .json({ success: false, error: `User not found` });
              }
              try {
                await sendTemplateEmail({
                  to: user.email,
                  user: user.fname + " " + user.lname,
                  templateName: body.isSuccess ? "training_completed" : "error",
                  job_name: job.name,
                });
              } catch (error) {
                return res.status(400).json({ success: false, error: error });
              }
            }).catch((err) => {
              return res.status(400).json({ success: false, error: err });
            });
          });
        }
        if (req.params.statusName === JobStatus.PREDICTING)
          job.predictionStartedAt = new Date().getTime();
        if (req.params.statusName === JobStatus.PREDICTING_COMPLETED) {
          job.predictionFinishedAt = new Date().getTime();
          job.status = body.isSuccess ? job.status : JobStatus.ERROR;
          job.users.forEach(async (element) => {
            await User.findOne({ _id: element }, async (err, user) => {
              if (err) {
                return res.status(400).json({ success: false, error: err });
              }
              if (!user) {
                return res
                  .status(404)
                  .json({ success: false, error: `User not found` });
              }
              try {
                await sendTemplateEmail({
                  to: user.email,
                  user: user.fname + " " + user.lname,
                  templateName: body.isSuccess
                    ? "prediction_completed"
                    : "error",
                  job_name: job.name,
                  size: "0.51 KB",
                });
              } catch (error) {
                return res.status(400).json({ success: false, error: error });
              }
            }).catch((err) => {
              return res.status(400).json({ success: false, error: err });
            });
          });
        }
      }
    }

    job
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: job._id,
          message: "Job updated!",
        });
      })
      .catch((error) => {
        return res.status(404).json({
          error,
          message: "Job not updated!",
        });
      });
  });
};

deleteJob = async (req, res) => {
  console.log("request received");
  // let token = req.headers.authorization.split(" ")[1];
  // const decoded = jwt.verify(token, secret);
  // var userId = decoded._id;
  var userId = req._id;
  console.log("user id here");
  console.log(userId);

  await User.findOne({ _id: userId }, async (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user) {
      console.log("request id here");
      console.log(req.params.id);
      // console.log("user jobs");
      // console.log(user.jobs);
      return res.status(404).json({ success: false, error: `User not found` });
    }

    try {
      console.log("request id here");
      console.log(req.params.id);
      console.log("user jobs");
      console.log(user.jobs);

      if (user.jobs.includes(req.params.id)) {
        console.log("request id here");
        console.log(req.params.id);
        await Job.findOneAndDelete({ _id: req.params.id }, (err, job) => {
          if (err) {
            return res.status(400).json({ success: false, error: err });
          }
          if (!job) {
            console.log("request id here");
            console.log(req.params.id);
            console.log("user jobs");
            console.log(user.jobs);
            return res
              .status(404)
              .json({ success: false, error: `Job not found` });
          }

          return res.status(200).json({ success: true, data: job });
        }).catch((err) => {
          return res.status(400).json({ success: false, error: err });
        });
      } else {
        return res
          .status(400)
          .json({ success: false, error: `User not authorized` });
      }
    } catch (error) {
      return res.status(400).json({ success: false, error: error });
    }
  });
};

getJobById = async (req, res) => {
  await Job.findOne({ _id: req.params.id }, (err, job) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!job) {
      return res.status(404).json({ success: false, error: `Job not found` });
    }
    return res.status(200).json({ success: true, data: job });
  }).catch((err) => {
    return res.status(400).json({ success: false, error: err });
  });
};

getJobs = async (req, res) => {
  return await Job.find({}, (err, job) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!job.length) {
      return res.status(404).json({ success: false, error: `Job not found` });
    }
  })
    .populate("users", "-jobs")
    .exec((err, populatedJob) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }

      if (!populatedJob) {
        return res
          .status(404)
          .json({ success: false, error: `User not found` });
      }
      return res.status(200).json({ success: true, data: populatedJob });
    });
};

getUserJobs = async (req, res) => {
  // console.log("get request received");
  // console.log("request received");
  // let token = req.headers.authorization.split(" ")[1];
  // const decoded = jwt.verify(token, secret);
  // var userId = decoded._id;
  var userId = req._id;
  // console.log("user id here");
  // console.log(userId);

  return await Job.find(
    { users: { $elemMatch: { $eq: ObjectId(userId) } } },
    (err, job) => {
      if (err) {
        console.log("error 1");
        console.log(err);
        return res.status(400).json({ success: false, error: err });
      }
      if (!job.length) {
        console.log("error 2");
        return res.status(404).json({ success: false, error: `Job not found` });
      }
      return res.status(200).json({ success: true, data: job });
    }
  );
};

addUsersToJob = async (req, res) => {
  console.log("share received");
  const body = req.body;
  console.log(body);
  return await User.find(
    {
      email: { $in: body.users },
    },
    function (err, docs) {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      let userIds = docs.map((x) => {
        return x["_id"];
      });
      Job.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { users: { $each: userIds } } },
        { new: true, useFindAndModify: false },
        (err, job) => {
          if (err) {
            return res.status(404).json({
              err,
              message: "Job not found!",
            });
          }
          userIds.map((x) => {
            addJobToUser(x, job);
          });
          return res.status(200).json({ success: true });
        }
      );
    }
  );
};

module.exports = {
  createJob,
  updateJob,
  updateJobStatus,
  deleteJob,
  getJobs,
  getJobById,
  addUsersToJob,
  uploadJob,
  getUserJobs,
  uploadTestFile,
  addJobToUser,
  uploadFileToServer,
  runPhase,
  JobStatus,
  getPreds,
  getPredFile,
  getFileText,
};
