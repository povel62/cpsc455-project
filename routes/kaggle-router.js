const express = require("express");

const KaggleCtrl = require("../controllers/kaggle-ctrl");
const GenericCtrl = require("../controllers/generic-ctrl");

const router = express.Router();

router.post(
  "/kaggle/:id/:jid/competitions/:ref/submit/:name",
  // GenericCtrl.verifyToken,
  KaggleCtrl.competitionUploadSubmit
);
router.post(
  "/kaggle/:id/:jid/datasets/version/new/:name",
  // GenericCtrl.verifyToken,
  KaggleCtrl.datasetCreateVersion
);
router.get("/kaggle/getKaggleFile/:id", KaggleCtrl.getKaggleFile);
router.get("/kaggle/getCompetitionsColumns/:id", KaggleCtrl.getCompColumns);
router.post(
  "/kaggle/:id/job",
  KaggleCtrl.validateKaggleJob,
  KaggleCtrl.uploadJob
);
router.post("/kaggle/:id/predict", KaggleCtrl.createKagglePrediction);

module.exports = router;
