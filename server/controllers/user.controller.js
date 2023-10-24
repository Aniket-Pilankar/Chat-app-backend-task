const express = require("express");
const router = express.Router();

const User = require("../models/userModal");
const authMiddleware = require("../middlewares/auth.middleware");

// Get all user expect the one with current logged in
router.get("", authMiddleware, async (req, res) => {
  console.log("IN user controller", req.query.search);

  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
