const express = require("express");

const KaggleCtrl = require("../controllers/kaggle-ctrl");

const router = express.Router();

router.get("/competitions/list", KaggleCtrl.getCompetitions);
router.get("/competitions/submissions/list", KaggleCtrl.getSubmissions);

router.get("/competitions/data/list/:id", KaggleCtrl.getDataListById);
router.get(
  "/competitions/data/download/:id/:filename",
  KaggleCtrl.getCompetitionFile
);
router.get(
  "/competitions/data/download/:id/",
  KaggleCtrl.getAllCompetitionFiles
);

router.get("/datasets/list", KaggleCtrl.getDatasets);
router.get(
  "/datasets/list/:ownerSlug/:datasetSlug",
  KaggleCtrl.getDatasetFileList
);
router.get("/datasets/view/:ownerSlug/:datasetSlug", KaggleCtrl.viewDataset);
router.get(
  "/datasets/download/:ownerSlug/:datasetSlug/:fileName",
  KaggleCtrl.getDatasetFile
);
router.get(
  "/datasets/download/:ownerSlug/:datasetSlug",
  KaggleCtrl.getDatasetFiles
);

router.post("/competitions/upload", KaggleCtrl.competitionUpload);
router.post("/datasets/create/new", KaggleCtrl.datasetCreate);
router.post(
  "/datasets/upload/file/:contentLength/:lastModifiedDateUtc",
  KaggleCtrl.datasetUpload
);

module.exports = router;
