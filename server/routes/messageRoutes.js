const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/message.controller");
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.route("/").post(authMiddleware, sendMessage);
router.route("/:chatId").get(authMiddleware, allMessages);

module.exports = router;