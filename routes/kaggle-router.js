const express = require("express");

const KaggleCtrl = require("../controllers/kaggle-ctrl");
const GenericCtrl = require("../controllers/generic-ctrl");

const router = express.Router();

router.post(
  "/kaggle/:jid/competitions/:ref/submit/:name",
  GenericCtrl.verifyToken,
  KaggleCtrl.competitionUploadSubmit
);
router.post(
  "/kaggle/:jid/datasets/version/new/:name",
  GenericCtrl.verifyToken,
  KaggleCtrl.datasetCreateVersion
);
router.get(
  "/kaggle/getKaggleFile",
  GenericCtrl.verifyToken,
  KaggleCtrl.getKaggleFile
);
router.get(
  "/kaggle/getCompetitionsColumns",
  GenericCtrl.verifyToken,
  KaggleCtrl.getCompColumns
);
router.post(
  "/kaggle/job",
  GenericCtrl.verifyToken,
  KaggleCtrl.validateKaggleJob,
  KaggleCtrl.uploadJob
);
router.post(
  "/kaggle/predict",
  GenericCtrl.verifyToken,
  KaggleCtrl.createKagglePrediction
);

module.exports = router;
