const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../util/security");

const Schema = mongoose.Schema;

const User = new Schema(
  {
    guest: { type: Boolean, required: true },
    fname: { type: String, required: false },
    lname: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    // dob: { type: String, required: false },
    kusername: { type: String, required: false },
    kapi: { type: String, get: decrypt, set: encrypt, required: false },
    jobs: [{ type: Schema.Types.ObjectId, ref: "jobs" }],
  },
  { timestamps: true, toObject: { getters: true }, toJSON: { getters: true } }
);
module.exports = mongoose.model("users", User);
