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

export const userJobItems = (email, login_token) => {
  return new Promise((resolve) => {
    axios.get("/api/user", { params: { email: email } }).then((user) => {
      console.log(user);
      axios
        .get(`/api/user/jobs`, {
          headers: {
            Authorization: "Bearer " + login_token.accessToken,
          },
        })
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
                  <MenuItem
                    value={job.id}
                    key={i}
                    data-my-value={{
                      title: job.name,
                      kaggleType: job.kaggleType,
                      kaggleId: job.kaggleId,
                    }}
                  >
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

export const sourceRef = (source, datasets, competitions) => {
  if (!source) {
    return null;
  } else if (source.mode === "COMPETITION") {
    return competitions[source.index].ref;
  } else {
    return datasets[source.index].ref;
  }
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

export const getPred = (job, file) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/job/${job}/pred/${file}`, {
        responseType: "arraybuffer",
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res);
        } else {
          reject();
        }
      })
      .catch(() => reject());
  });
};

export const getPredCol = (job) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/job/${job}`)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data.data.headers);
        } else {
          reject([]);
        }
      })
      .catch(() => reject([]));
  });
};

export function acceptableJobStatus(status) {
  switch (status) {
    case "TRAINING_COMPLETED":
    case "PREDICTING":
    case "PREDICTING_COMPLETED":
      return true;
    default:
      return false;
  }
}

export const fileDownload = (url, file, token, email) => {
  axios.get("/api/user", { params: { email: email } }).then((user) => {
    let id = user.data.data.id;
    axios
      .get(`/api/kaggle/getKaggleFile/${id}`, {
        responseType: "arraybuffer",
        auth: token,
        params: { url: url },
      })
      .then((res) => {
        if (res.status === 200) {
          let name =
            res.headers["content-type"] === "application/zip"
              ? file.name + ".zip"
              : file.name;
          const addr = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = addr;
          link.setAttribute("download", name);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(addr);
        }
      });
  });
};

export const getColumnDownloadMethod = (email, token, handleDownload, col) => {
  return new Promise((resolve) => {
    axios.get("/api/user", { params: { email: email } }).then((user) => {
      let id = user.data.data.id;
      handleDownload().then((url) => {
        axios
          .get(`/api/kaggle/getCompetitionsColumns/${id}`, {
            auth: token,
            params: { url: url },
          })
          .then((res) => {
            if (res.status === 200) {
              col = res.data.data;
              resolve(col);
            }
          });
      });
    });
  });
};

// export const getSubmissions = (email) => {
//   return new Promise((resolve) => {
// credentials(email).then((creds))
//     // www.kaggle.com/api/v1/competitions/submissions/list/titanic?page=2
//     // get user submissions, until [] is returned (end of list)
//     // TODO
//     resolve([]);
//   });
// };

// const getSubmissionPage = (ref, page,creds) => {
//   // TODO get a single submission page
// };

// export const getDatasetView = (email) => {
//   credentials(email).then((creds)=> {
// // TODO get more info from datasets, (license data,...? )
// // /datasets/view/{ownerSlug}/{datasetSlug}
//   })
// }
