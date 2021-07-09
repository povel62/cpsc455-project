const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
const { secret } = require("../util/security");
const fs = require("fs");
const { Readable } = require("stream");
let { PythonShell } = require("python-shell");
const { CSV_FILES, SESSIONS, HOSTNAME } = require("../GlobalConstants");
const crypto = require("crypto");

verifyToken = (req, res, next) => {
  if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ").length < 2
  ) {
    return res.status(403).send({ message: "No token provided!" });
  }

  let token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req._id = decoded._id;
    next();
  });
};

addJobToUser = async (userId, job) => {
  return User.findByIdAndUpdate(
    userId,
    { $addToSet: { jobs: job._id } },
    { new: true, useFindAndModify: false }
  );
};

uploadFileToServer = async (id, fileData, fileName) => {
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
              reject(err);
            }
          }
          fs.unlinkSync(path);
          resolve(results1);
        }
      );
    } catch (e) {
      console.log(e);
      fs.unlinkSync(path);
      reject(e);
    }
  });
};

runPhase = async (
  fullFilePath,
  jobId,
  durationLimit,
  targetColumnName,
  email,
  jobName,
  callbackUrl,
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
      callbackUrl,
    ],
  };
  return new Promise((resolve, reject) => {
    try {
      PythonShell.run(
        `./util/run_${isTrainPhase ? "train.py" : "predict.py"}`,
        options,
        function (err, results1) {
          if (err) {
            if (err != null) {
              resolve(err);
            }
          }
          resolve(results1);
        }
      );
    } catch (err) {
      reject("error running python code'");
    }
  });
};

getPredFileNames = (id) => {
  let options = {
    args: [id],
  };

  return new Promise((resolve, reject) => {
    try {
      PythonShell.run(
        "./util/run_getPredictions.py",
        options,
        function (err, results1) {
          if (err) {
            if (err != null) {
              resolve(err);
            }
          }
          resolve(results1);
        }
      );
    } catch {
      reject("error running python code'");
    }
  });
};

getPredFileText = (id, name, path) => {
  let options = {
    args: [path, id, name],
  };

  return new Promise((resolve, reject) => {
    try {
      PythonShell.run(
        "./util/run_getPredictionFile.py",
        options,
        function (err, results1) {
          if (err) {
            if (err != null) {
              console.log(err);
              resolve(err);
            }
          }
          console.log(results1);
          resolve(results1);
        }
      );
    } catch (err) {
      console.log(err);
      reject("error running python code'");
    }
  });
};

module.exports = {
  verifyToken,
  addJobToUser,
  uploadFileToServer,
  runPhase,
  getPredFileNames,
  getPredFileText,
};
