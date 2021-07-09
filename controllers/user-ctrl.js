const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const salt = 10;
const { validateGuest } = require("../util/validation");
const jwt = require("jsonwebtoken");
const { secret } = require("../util/security");
const validator = require("email-validator");
const { sendTemplateEmail } = require("./send-email");

createUser = async (req, res) => {
  const body = req.body;
  if (!validator.validate(body.email)) {
    return res.status(400).json({
      success: false,
      error: "User email is not valid!",
    });
  }
  await User.findOne({ email: body.email }, async (err, user) => {
    if (user) {
      if (!user.guest) {
        return res.status(400).json({
          success: false,
          error: `User: ${body.email} already exists`,
        });
      } else {
        user.guest = false;

        user.fname = body.fname;
        user.lname = body.lname;
        user.email = body.email;
        user.dob = body.dob;

        if (body.kusername) {
          user.kusername = body.kusername;
        }
        if (body.kapi) {
          user.kapi = body.kapi;
        }
      }
    } else {
      if (!body) {
        return res.status(400).json({
          success: false,
          error: "You must provide a user",
        });
      }
      let newUser = body;
      if (newUser.password) {
        newUser.password = await bcrypt.hash(newUser.password, salt);
      }
      user = new User(newUser);
      validateGuest(body, user);
    }

    user
      .save()
      .then(async () => {
        await sendTemplateEmail({
          to: user.email,
          templateName: "welcome",
          name: user.fname + " " + user.lname,
          Sender_Name: "AutoML",
          Sender_Address: "UBC",
          Sender_City: "Vancouver",
          Sender_State: "BC",
          Sender_Zip: "V6T 1Z4",
        });
        return res.status(201).json({
          success: true,
          id: user._id,
          message: "User created!",
        });
      })
      .catch((error) => {
        return res.status(400).json({
          error,
          message: "User not created!",
        });
      });
  });
};

update = async (req, res) => {
  console.log("request received");

  let token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, secret);
  var userId = decoded._id;
  console.log(userId);

  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update",
    });
  }

  console.log(body);

  User.findOne({ _id: userId }, (err, user) => {
    if (err) {
      console.log("error1");
      return res.status(404).json({
        err,
        message: "User not found!",
      });
    }

    if (user.guest === true) {
      return res.status(403).json({
        message: "Forbidden for guest users",
      });
    }
    if (body.fname) {
      user.fname = body.fname;
    }
    if (body.lname) {
      user.lname = body.lname;
    }
    if (body.email) {
      user.email = body.email;
    }
    if (body.password) {
      user.password = body.password;
    }
    if (body.dob) {
      user.dob = body.dob;
    }

    if (body.kusername) {
      user.kusername = body.kusername;
    }
    if (body.kapi) {
      user.kapi = body.kapi;
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
        console.log("error2");
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

    return res.status(200).json({ success: true, data: user });
  }).catch((err) => {
    return res.status(400).json({ success: false, error: err });
  });
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
  }).catch((err) => {
    return res.status(400).json({ success: false, error: err });
  });
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
  }).catch((err) => {
    return res.status(400).json({ success: false, error: err });
  });
};

getUsers = async (req, res) => {
  await User.find({}, (err, users) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!users.length) {
      return res.status(404).json({ success: false, error: `User not found` });
    }
  })
    .populate("jobs", "-users")
    .exec((err, populatedUser) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }

      if (!populatedUser) {
        return res
          .status(404)
          .json({ success: false, error: `User not found` });
      }
      return res.status(200).json({ success: true, data: populatedUser });
    });
};

login = async (req, res) => {
  const body = req.body;

  await User.findOne({ email: body.email }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: `User not found` });
    } else if (!user.guest || user.guest === false) {
      if (user.password === undefined || user.password === "") {
        return res.status(404).json({
          success: false,
          error: `User is already registered as a regualar user. Please sign in as a regular user.`,
        });
      }
      let passCorrect = false;
      try {
        passCorrect = bcrypt.compareSync(body.password, user.password, salt);
      } catch (e) {
        return res.status(404).json({
          success: false,
          error: `User is already registered as a regualar user. Please sign in as a regular user.`,
        });
      }
      if (!passCorrect) {
        return res
          .status(404)
          .json({ success: false, error: `Password not correct` });
      }
    } else if (
      user.guest &&
      body.password !== undefined &&
      body.password !== ""
    ) {
      return res
        .status(404)
        .json({ success: false, error: `This is a guest user.` });
    }
    return res.status(200).json({
      success: true,
      data: user,
      accessToken: jwt.sign({ _id: user._id }, secret, { expiresIn: 86400 }),
    });
  }).catch((err) => {
    return res.status(400).json({ success: false, error: err });
  });
};
module.exports = {
  createUser,
  deleteUser,
  getUsers,
  getUserById,
  getUserByEmail,
  login,
  update,
};
