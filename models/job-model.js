const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Job = new Schema(
    {
        status: { type: String, required: true },
        durationLimit: { type: Number, required: false },
        totalDuration: { type: Number, required: false },
        name: { type: String, required: true },
        kaggleCompId: { type: String, required: false },
        users: [{ type: Schema.Types.ObjectId, ref: 'users' }]
    },
    { timestamps: true, toObject: { getters: true }, toJSON: { getters: true } }
);
module.exports = mongoose.model("jobs", Job);
