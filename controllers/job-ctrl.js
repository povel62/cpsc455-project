const Job = require("../models/job-model");
const User = require("../models/user-model");
const { addJobToUser } = require("./generic-ctrl");
const ObjectId = require("mongodb").ObjectID;
let { PythonShell } = require("python-shell");
var crypto = require("crypto");

uploadFileToServer = (id, fileData, fileName) => {
  let options = {
    args: [id, fileData, fileName],
  };

  PythonShell.run("./util/run_upload.py", options, function (err, results1) {
    if (err) {
      if (err != null) {
        return err;
      }
    }
    return results1;
  });
};

runPhase = (
  fullFilePath,
  jobId,
  durationLimit,
  targetColumnName,
  email,
  jobName,
  isTrainPhase
) => {
  let options = {
    args: [
      fullFilePath,
      jobId,
      durationLimit,
      targetColumnName,
      email,
      jobName,
    ],
  };

  PythonShell.run(
    `./util/run_${isTrainPhase ? "train.py" : "predict.py"}`,
    options,
    function (err, results1) {
      if (err) {
        if (err != null) {
          return err;
        }
      }
      return results1;
    }
  );
};

const JobStatus = {
  CREATED: "CREATED",
  TRAINING: "TRAINING",
  TRAINING_COMPLETED: "TRAINING_COMPLETED",
  PREDICTING: "PREDICTING",
  PREDICTING_COMPLETED: "PREDICTING_COMPLETED", // or PREDICTING_COMPLETED
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
      console.log(error);
      return res.status(400).json({
        error,
        message: "Job not created!",
      });
    });
};

uploadJob = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a job",
    });
  }

  if (!req.files) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }
  let fileData = req.files.file.data.toString("utf8");

  let newJob = body;
  newJob.users = [req.params.id];
  let job = new Job(newJob);

  job.headers = fileData.split("\n")[0].split(",");

  if (!job) {
    return res.status(400).json({ success: false, error: err });
  }
  job.trainingStartedAt = new Date().getTime();
  job.status = JobStatus.TRAINING;

  job
    .save()
    .then(() => {
      addJobToUser(req.params.id, job);
      // TODO: According to status, upload training or pred file (upload code)
      // uploadFileToServer(job._id, fileData, 'train.csv');
      // runPhase(process.env.CSV_FILES + "/" + job._id + "/" + 'train.csv', job._id, job.durationLimit, job.targetColumnName, 'povel62@yahoo.ca', job.name, true)
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

uploadTestFile = async (req, res) => {
  const body = req.body;

  if (!req.files) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }
  let tmpFileData = req.files.file.data.toString("utf8");
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
      csvLinesArr.split("\n").forEach((x, index) => {
        if (index === 0) {
          fileData += `,${job.targetColumnName}`;
        } else if (index === csvLinesArr.length - 1) {
          // do nothing
        } else {
          fileData += x + ",";
        }
      });
    }
    headers = fileData.split("\n")[0].split(",");
    if (headers.length !== job.headers.length) {
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
        // TODO: According to status, upload training or pred file (upload code)
        // let id = crypto.randomBytes(20).toString('hex');
        // uploadFileToServer(job_id, fileData, id + '.csv');
        // runPhase(process.env.CSV_FILES + "/" + job._id + "/" + id + '.csv', job._id, job.durationLimit, job.targetColumnName, 'povel62@yahoo.ca', job.name, false)

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
    if (Object.values(JobStatus).includes(req.params.statusName)) {
      if (req.params.statusName) {
        job.status = req.params.statusName;
        if (req.params.statusName === JobStatus.TRAINING)
          job.trainingStartedAt = new Date().getTime();
        if (req.params.statusName === JobStatus.PREDICTING)
          job.predictionStartedAt = new Date().getTime();
        if (req.params.statusName === JobStatus.COMPLETED)
          job.predictionFinishedAt = new Date().getTime();
      }
    }

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

deleteJob = async (req, res) => {
  await Job.findOneAndDelete({ _id: req.params.id }, (err, job) => {
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
  return await Job.find(
    { users: { $elemMatch: { $eq: ObjectId(req.params.id) } } },
    (err, job) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!job.length) {
        return res.status(404).json({ success: false, error: `Job not found` });
      }
      return res.status(200).json({ success: true, data: job });
    }
  );
};

addUsersToJob = async (req, res) => {
  const body = req.body;
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
};
