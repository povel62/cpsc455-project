const loginUser = async (bodyObj) => {
  const response = await fetch("/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyObj),
  });
  return response.json();
};

const signupUser = async (bodyObj) => {
  const response = await fetch("/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyObj),
  });
  return response.json();
};

module.exports = {
  loginUser,
  signupUser,
};
