const express = require("express");

const KaggleCtrl = require("../controllers/kaggle-ctrl");
const GenericCtrl = require("../controllers/generic-ctrl");

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
router.get(
  "/kaggle/getKaggleFile",
  GenericCtrl.verifyToken,
  KaggleCtrl.getKaggleFile
);
router.post("/kaggle/job", KaggleCtrl.createKaggleJob);

router.post("/kaggle/predict", KaggleCtrl.createKagglePrediction);


module.exports = router;
