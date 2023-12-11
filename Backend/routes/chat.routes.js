const express = require("express")
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const chatController = require("../controllers/chat.controllers")

router.post("/", protect, chatController.accessChat)
router.get("/", protect, chatController.fetchChats)


module.exports = router;