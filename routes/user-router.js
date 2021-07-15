const express = require("express");

const UserCtrl = require("../controllers/user-ctrl");
const GenericCtrl = require("../controllers/generic-ctrl");

const router = express.Router();

router.post("/user", UserCtrl.createUser);
router.delete("/user/:id", GenericCtrl.verifyToken, UserCtrl.deleteUser);
//router.get("/user/:id", UserCtrl.getUserById);
router.get("/user", UserCtrl.getUserByEmail);
router.post("/user/login", UserCtrl.login);
router.get("/users", UserCtrl.getUsers);
router.put("/user/update", GenericCtrl.verifyToken, UserCtrl.update);

module.exports = router;
