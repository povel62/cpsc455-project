import axios from "axios";
import { MenuItem } from "@material-ui/core";
import React from "react";
export const dataType = "DATA";
export const compType = "COMPETITION";
export const kaggleBaseUrl = "https://www.kaggle.com/api/v1";
export const credentials = (email) => {
  // TODO reject to unauthorized instead of blank
  if (!email) {
    return new Promise((resolve) => {
      resolve({
        username: "",
        password: "",
      });
    });
  }
  return new Promise((resolve) => {
    axios
      .get("/api/user", { params: { email: email } })
      .then((res) => {
        if (res.status === 200) {
          if (!res.data.data.kusername || !res.data.data.kapi) {
            resolve({ username: "", password: "" });
          }
          resolve({
            username: res.data.data.kusername,
            password: res.data.data.kapi,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        resolve({
          username: "",
          password: "",
        });
      });
  });
};

export const competitionAuth = (ref, email) => {
  return new Promise((resolve) => {
    credentials(email).then((auth) => {
      axios
        .get(kaggleBaseUrl + `/competitions/submissions/list/${ref}`, {
          auth: auth,
        })
        .then((res) => {
          if (res.status === 200) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(() => {
          resolve(false);
        });
    });
  });
};

export const KaggleAuthCheck = (email) => {
  return new Promise((resolve) => {
    credentials(email).then((auth) => {
      axios
        .get(kaggleBaseUrl + `/competitions/list`, { auth: auth })
        .then((res) => {
          if (res.status === 200) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(() => {
          resolve(false);
        });
    });
  });
};

export const userJobItems = (email) => {
  return new Promise((resolve) => {
    axios.get("/api/user", { params: { email: email } }).then((user) => {
      let id = user.data.data.id;
      axios
        .get(`/api/user/${id}/jobs`)
        .then((data) => {
          if (data.status === 200) {
            let jobData = data.data.data;
            if (jobData) {
              let accepted = jobData.filter((ele) =>
                acceptableJobStatus(ele.status)
              );
              if (accepted.length === 0) {
                resolve([]);
              }
              let elements = accepted.map((job, i) => {
                return (
                  <MenuItem value={job.id} key={i}>
                    {job.name}
                  </MenuItem>
                );
              });
              resolve(elements);
            } else {
              resolve([]);
            }
          }
        })
        .catch(() => {
          resolve([]);
        });
    });
  });
};

export const getJobPreds = (job) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/job/${job}/preds`)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data.fileNames);
        } else {
          resolve([]);
        }
      })
      .catch(() => reject([]));
  });
};

export function acceptableJobStatus(status) {
  // TODO move to serverside
  switch (status) {
    case "TRAINING_COMPLETED":
    case "PREDICTING":
    case "PREDICTING_COMPLETED":
      return true;
    default:
      return false;
  }
}
