const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const salt = 10;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const secret = crypto.randomBytes(60).toString("utf8");

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

createUser = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a user",
    });
  }
  let newUser = body;
  newUser.password = await bcrypt.hash(newUser.password, salt);

  const user = new User(newUser);

  if (!user) {
    return res.status(400).json({ success: false, error: err });
  }

  user
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: user._id,
        message: "User created!",
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({
        error,
        message: "User not created!",
      });
    });
};

updateUser = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update",
    });
  }

  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "User not found!",
      });
    }

    user.fname = body.fname;
    user.lname = body.lname;
    user.email = body.email;
    user.password = body.password;
    user.dob = body.dob;
    // allow empty field to remove kaggle account link
    if (body.kusername) {
      user.kusername = body.kusername;
    } else {
      user.kusername = "";
    }

    if (body.kapi) {
      user.kapi = body.kapi;
    } else {
      user.kapi = "";
    }

    user
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: user._id,
          message: "User updated!",
        });
      })
      .catch((error) => {
        return res.status(404).json({
          error,
          message: "User not updated!",
        });
      });
  });
};

deleteUser = async (req, res) => {
  await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: `User not found` });
    }

    return res.status(200).json({ success: true, data: user });
  }).catch((err) => console.log(err));
};

getUserById = async (req, res) => {
  await User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: `User not found` });
    }
    try {
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      return res.status(400).json({ success: false, error: error });
    }
  }).catch((err) => console.log(err));
};

getUserByEmail = async (req, res) => {
  await User.findOne({ email: req.query.email }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: `User not found` });
    }
    return res.status(200).json({ success: true, data: user });
  }).catch((err) => console.log(err));
};

getUsers = async (req, res) => {
  await User.find({}, (err, users) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!users.length) {
      return res.status(404).json({ success: false, error: `User not found` });
    }
    return res.status(200).json({ success: true, data: users });
  }).catch((err) => console.log(err));
};

getUserByEmailAndPassword = async (req, res) => {
  const body = req.body;

  await User.findOne({ email: body.email }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: `User not found` });
    } else {
      let passCorect = bcrypt.compareSync(body.password, user.password, salt);
      if (!passCorect) {
        return res
          .status(404)
          .json({ success: false, error: `Password not correct` });
      }
    }
    return res.status(200).json({
      success: true,
      data: user,
      accessToken: jwt.sign({ _id: user._id }, secret, { expiresIn: 86400 }),
    });
  }).catch((err) => console.log(err));
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  verifyToken,
  getUsers,
  getUserById,
  getUserByEmail,
  getUserByEmailAndPassword,
};
