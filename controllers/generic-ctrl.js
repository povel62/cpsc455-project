const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
const { secret } = require("../util/security");

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

module.exports = {
  verifyToken,
  addJobToUser,
};
