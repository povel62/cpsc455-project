const express = require("express");

const JobCtrl = require("../controllers/job-ctrl");
const GenericCtrl = require("../controllers/generic-ctrl");

const router = express.Router();

router.post("/user/:id/job", JobCtrl.createJob);
router.put("/job/:id", GenericCtrl.verifyToken, JobCtrl.updateJob);
router.delete("/job/:id", GenericCtrl.verifyToken, JobCtrl.deleteJob);
router.get("/job/:id", JobCtrl.getJobById);
router.get("/jobs", JobCtrl.getJobs);
router.post("/job/:id/addUsers", JobCtrl.addUsersToJob);

module.exports = router;
