const express = require("express");

const JobCtrl = require("../controllers/job-ctrl");
const GenericCtrl = require("../controllers/generic-ctrl");

const router = express.Router();

router.post("/user/:id/job", JobCtrl.createJob);
router.post("/user/:id/job/upload", JobCtrl.uploadJob);
router.get("/user/:id/jobs", JobCtrl.getUserJobs);
router.patch("/job/:id/status/:statusName", JobCtrl.updateJobStatus);
router.put("/job/:id", JobCtrl.updateJob);
router.delete("/job/:id", GenericCtrl.verifyToken, JobCtrl.deleteJob);
router.get("/job/:id", JobCtrl.getJobById);
router.post("/job/:id/upload", JobCtrl.uploadTestFile);
router.get("/jobs", JobCtrl.getJobs);
router.post("/job/:id/addUsers", JobCtrl.addUsersToJob);

module.exports = router;
