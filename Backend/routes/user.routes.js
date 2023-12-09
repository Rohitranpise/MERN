const express = require("express")
const router = express.Router();
const userController = require("../controllers/user.controllers");
const { protect } = require("../middlewares/auth.middleware");

router.post("/", userController.registerUser)
router.post("/login", userController.authUser)
router.get("/", protect, userController.getAllUsers)

module.exports = router;