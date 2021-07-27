import axios from "axios";
import { MenuItem } from "@material-ui/core";
import React from "react";
export const dataType = "DATA";
export const compType = "COMPETITION";
export const kaggleBaseUrl = "https://www.kaggle.com/api/v1";

export const credentials = (token) => {
  return new Promise((resolve) => {
    if (!token) {
      resolve({ username: "", password: "" });
    }
    axios
      .get("/api/myUser", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
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

export const competitionAuth = (ref, token) => {
  return new Promise((resolve) => {
    credentials(token).then((auth) => {
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

export const KaggleAuthCheck = (token) => {
  return new Promise((resolve) => {
    credentials(token).then((auth) => {
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

export const userJobItems = (token) => {
  return new Promise((resolve) => {
    axios
      .get(`/api/user/jobs`, {
        headers: {
          Authorization: "Bearer " + token,
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

export const getJobPreds = (job, token) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/job/${job}/preds`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
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

export const getPred = (job, file, token) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `/api/job/${job}/pred/${file}`,
        {
          responseType: "arraybuffer",
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
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

export const getPredCol = (job, token) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/job/${job}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
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

export const fileDownload = (url, file, token) => {
  axios
    .get(`/api/kaggle/getKaggleFile`, {
      responseType: "arraybuffer",
      headers: {
        Authorization: "Bearer " + token,
      },
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
};

export const getColumnDownloadMethod = (token, handleDownload, col) => {
  return new Promise((resolve) => {
    handleDownload().then((url) => {
      axios
        .get(`/api/kaggle/getCompetitionsColumns`, {
          headers: {
            Authorization: "Bearer " + token,
          },
          params: { url: url },
        })
        .then((res) => {
          if (res.status === 200) {
            col = res.data.data;
            resolve(col);
          }
        })
        .catch((err) => {
          console.log(err);
          resolve([]);
        });
    });
  });
};

export const getSubmissions = async (token, ref) => {
  return new Promise((resolve, reject) => {
    credentials(token)
      .then(async (auth) => {
        let i = 1;
        let subs = [];
        let sub = [];
        do {
          sub = await axios.get(
            `${kaggleBaseUrl}/competitions/submissions/list/${ref}`,
            { params: { page: i }, auth: auth }
          );
          if (sub && sub.data) {
            subs.push(...sub.data);
          }
          i++;
        } while (i < 50 && sub.length > 0);
        resolve(subs);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getDatasetView = (auth, ref) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${kaggleBaseUrl}/datasets/view/${ref}`, {
        auth: auth,
      })
      .then((res) => {
        if (res.data) {
          resolve(res.data);
        } else {
          reject("No data");
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
