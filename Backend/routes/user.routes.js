const express = require("express")
const router = express.Router();
const userController = require("../controllers/user.controllers")

router.post("/", userController.registerUser)
router.post("/login", userController.authUser)

module.exports = router;