const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Job = new Schema(
  {
    status: { type: String, required: true },
    durationLimit: { type: Number, required: false },
    trainingStartedAt: { type: Number, required: false },
    predictionStartedAt: { type: Number, required: false },
    predictionFinishedAt: { type: Number, required: false },
    name: { type: String, required: true },
    kaggleId: { type: String, required: false },
    kaggleType: { type: String, required: false },
    kaggleSrc: { type: String, required: false },
    targetColumnName: { type: String, required: false },
    targetColumnIndex: { type: Number, required: false },
    headers: [{ type: String, required: false }],
    users: [{ type: Schema.Types.ObjectId, ref: "users" }],
  },
  { timestamps: true, toObject: { getters: true }, toJSON: { getters: true } }
);
module.exports = mongoose.model("jobs", Job);
