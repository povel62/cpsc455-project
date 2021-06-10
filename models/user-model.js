const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../util/security");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    dob: { type: String, required: true },
    kusername: { type: String, required: false },
    kapi: { type: String, get: decrypt, set: encrypt, required: false },
  },
  { timestamps: true, toObject: { getters: true }, toJSON: { getters: true } }
);

module.exports = mongoose.model("users", User);
