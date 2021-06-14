const Job = require("../models/job-model");
const User = require("../models/user-model");
const { addJobToUser } = require("./generic-ctrl");
const mongoose = require("mongoose");

createJob = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "You must provide a job",
        });
    }
    let newJob = body;
    // let userId = new mongoose.mongo.ObjectId(req.params.id);
    newJob.users = [req.params.id];
    let job = new Job(newJob);

    console.log("job: " + job)

    if (!job) {
        return res.status(400).json({ success: false, error: err });
    }

    job
        .save()
        .then(() => {
            addJobToUser(req.params.id, job);
            return res.status(201).json({
                success: true,
                id: job._id,
                message: "Job created!",
            });
        })
        .catch((error) => {
            console.log(error)
            return res.status(400).json({
                error,
                message: "Job not created!",
            });
        });
};

updateJob = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "You must provide a body to update",
        });
    }

    Job.findOne({ _id: req.params.id }, (err, job) => {
        if (err) {
            return res.status(404).json({
                err,
                message: "Job not found!",
            });
        }

        job = body;

        job
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: job._id,
                    message: "Job updated!",
                });
            })
            .catch((error) => {
                return res.status(404).json({
                    error,
                    message: "Job not updated!",
                });
            });
    });
};

deleteJob = async (req, res) => {
    await Job.findOneAndDelete({ _id: req.params.id }, (err, job) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!job) {
            return res.status(404).json({ success: false, error: `Job not found` });
        }

        return res.status(200).json({ success: true, data: job });
    }).catch((err) => console.log(err));
};

getJobById = async (req, res) => {
    await Job.findOne({ _id: req.params.id }, (err, job) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!job) {
            return res.status(404).json({ success: false, error: `Job not found` });
        }
        return res.status(200).json({ success: true, data: job });
    }).catch((err) => console.log(err));
};

getJobs = async (req, res) => {
    return await Job.find({}, (err, job) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!job.length) {
            return res.status(404).json({ success: false, error: `Job not found` });
        }
    }).populate('users', "-jobs").exec((err, populatedJob) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!populatedJob) {
            return res.status(404).json({ success: false, error: `User not found` });
        }
        return res.status(200).json({ success: true, data: populatedJob });
    });
};

addUsersToJob = async (req, res) => {
    const body = req.body;
    return await User.find({
        'email': { $in: body.users }
    }, function (err, docs) {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        let userIds = docs.map((x) => {
            return x["_id"];
        })
        Job.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { users: { $each: userIds } } },
            { new: true, useFindAndModify: false }, (err, job) => {
                if (err) {
                    return res.status(404).json({
                        err,
                        message: "Job not found!",
                    });
                }
                userIds.map((x) => {
                    addJobToUser(x, job);
                })
                return res.status(200).json({ success: true });
            });
    });
};

module.exports = {
    createJob,
    updateJob,
    deleteJob,
    getJobs,
    getJobById,
    addUsersToJob
};
