const express = require("express");

const JobCtrl = require("../controllers/job-ctrl");
const GenericCtrl = require("../controllers/generic-ctrl");

const router = express.Router();

router.post("/user/:id/job", JobCtrl.createJob);
router.post("/user/job/upload", GenericCtrl.verifyToken, JobCtrl.uploadJob);
router.get("/user/jobs", GenericCtrl.verifyToken, JobCtrl.getUserJobs);
router.patch("/job/:id/status/:statusName", JobCtrl.updateJobStatus);
router.put("/job/:id", JobCtrl.updateJob);
router.delete("/job/:id", GenericCtrl.verifyToken, JobCtrl.deleteJob);
router.get("/job/:id", JobCtrl.getJobById);
router.post("/job/:id/upload", JobCtrl.uploadTestFile);
router.get("/jobs", JobCtrl.getJobs);
router.post(
  "/job/addUsers/:id",
  GenericCtrl.verifyToken,
  JobCtrl.addUsersToJob
);
router.get("/job/:id/preds", JobCtrl.getPreds);
router.get("/job/:id/pred/:name", JobCtrl.getPredFile);

module.exports = router;
