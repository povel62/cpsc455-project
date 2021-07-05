const express = require("express");

const KaggleCtrl = require("../controllers/kaggle-ctrl");
const GenericCtrl = require("../controllers/generic-ctrl");
const JobCtrl = require("../controllers/job-ctrl");

const router = express.Router();

router.post(
  "/kaggle/checkAccount/:id",
  GenericCtrl.verifyToken,
  KaggleCtrl.checkAccount
);
router.post(
  "/kaggle/competitions/submit",
  GenericCtrl.verifyToken,
  KaggleCtrl.competitionUploadSubmit
);
router.post(
  "/kaggle/datasets/version/new",
  GenericCtrl.verifyToken,
  KaggleCtrl.datasetCreateVersion
);
router.get("/kaggle/getKaggleFile/:id", KaggleCtrl.getKaggleFile);
router.get("/kaggle/getCompetitionsColumns/:id", KaggleCtrl.getCompColumns);
router.post(
  "/kaggle/:id/job",
  KaggleCtrl.validateKaggleJob,
  KaggleCtrl.uploadJob
);
router.post("/kaggle/predict", KaggleCtrl.createKagglePrediction); // TODO add prediction

module.exports = router;
