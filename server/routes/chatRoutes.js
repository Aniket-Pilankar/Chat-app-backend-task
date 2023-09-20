const express = require("express");
const {
    accessChat,
    fetchChats,
    createGroupChat,
    removeFromGroup,
    addToGroup,
} = require("../controllers/chat.controller");
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.route("/").post(authMiddleware, accessChat);
router.route("/").get(authMiddleware, fetchChats);
router.route("/group").post(authMiddleware, createGroupChat);
router.route("/groupremove").put(authMiddleware, removeFromGroup);
router.route("/groupadd").put(authMiddleware, addToGroup);

module.exports = router;