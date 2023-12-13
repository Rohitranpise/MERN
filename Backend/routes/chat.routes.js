const express = require("express")
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const chatController = require("../controllers/chat.controllers")

router.post("/", protect, chatController.accessChat)
router.get("/", protect, chatController.fetchChats)
router.post("/group", protect, chatController.createGroupChat)
router.post("/rename", protect, chatController.renameGroup)
router.post("/groupadd", protect, chatController.addToGroup)
router.post("/groupremove", protect, chatController.removeFromGroup)


module.exports = router;