const express = require("express");

const UserCtrl = require("../controllers/user-ctrl");
const GenericCtrl = require("../controllers/generic-ctrl");

const router = express.Router();

router.post("/user", UserCtrl.createUser);
router.delete("/user/:id", GenericCtrl.verifyToken, UserCtrl.deleteUser);
router.get("/myUser", GenericCtrl.verifyToken, UserCtrl.getUserById);
router.post("/user/login", UserCtrl.login);
router.put("/user/update", GenericCtrl.verifyToken, UserCtrl.update);
router.post(
  "/user/stripe/charge",
  GenericCtrl.verifyToken,
  UserCtrl.makePayment
);
router.post(
  "/user/contact",
  GenericCtrl.verifyToken,
  UserCtrl.sendContactEmail
);

module.exports = router;
