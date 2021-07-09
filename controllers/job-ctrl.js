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
} = require("./generic-ctrl");
const { sendTemplateEmail } = require("./send-email");

tryTest = async () => {
  let options = {
    args: ["ls"],
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
        return res.status(404).json({
          error: err,
          message: "Cannot retreive files!",
        });
      }
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

getPredFile = async (req, res) => {
  Job.findOne({ _id: req.params.id }, (err, job) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "Job not found!",
      });
    }

    getPredFileText(job._id, req.params.name).then((s1) => {
      let csv = "";
      try {
        if (s1.length > 0) {
          JSON.parse(s1[0].replace(/'/g, '"')).map((x) => {
            csv += x;
          });
        }
      } catch (err) {
        return res.status(400).json({
          error: err,
          message: "Cannot get file data!",
        });
      }
      let exportFile = req.query.export;
      if (exportFile === "false") {
        return res.send(CSVToArray(csv, ","));
      } else {
        res.header("Content-Type", "text/csv");
        res.attachment(req.params.name);
        return res.send(csv);
      }
    });
  }).catch((error) => {
    return res.status(404).json({
      error,
      message: "Cannot find file!",
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
                  templateName: "training_completed",
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
                  templateName: "prediction_completed",
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
  addJobToUser,
  uploadFileToServer,
  runPhase,
  JobStatus,
  getPreds,
  getPredFile,
};
