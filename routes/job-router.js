const express = require("express");

const JobCtrl = require("../controllers/job-ctrl");
const GenericCtrl = require("../controllers/generic-ctrl");

const router = express.Router();

// router.post("/user/:id/job", JobCtrl.createJob);
router.post("/user/job/upload", GenericCtrl.verifyToken, JobCtrl.uploadJob);
router.get("/user/jobs", GenericCtrl.verifyToken, JobCtrl.getUserJobs);
router.patch("/job/:id/status/:statusName", JobCtrl.updateJobStatus); // TODO AUTH?
router.put("/job/:id", JobCtrl.updateJob); // TODO AUTH?
router.delete("/job/:id", GenericCtrl.verifyToken, JobCtrl.deleteJob);
router.get("/job/:id", JobCtrl.getJobById); // TODO AUTH?
router.post("/job/:id/upload", GenericCtrl.verifyToken, JobCtrl.uploadTestFile);
// router.get("/jobs", JobCtrl.getJobs);
router.post(
  "/job/addUsers/:id",
  GenericCtrl.verifyToken,
  JobCtrl.addUsersToJob
);
router.get("/job/:id/preds", GenericCtrl.verifyToken, JobCtrl.getPreds);
router.get("/job/:id/pred/:name", GenericCtrl.verifyToken, JobCtrl.getPredFile);
router.get(
  "/job/:id/file/:fileName",
  GenericCtrl.verifyToken,
  JobCtrl.getFileText
);

module.exports = router;
