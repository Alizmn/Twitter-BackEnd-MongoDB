const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../db/Schema/userSchema");

// ----------------USER DETAILS-----------------
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findOne({ username: req.user.username });
      res.send({ success: true, account: user });
    } catch (error) {
      res.status(500).json({ success: false, msg: "Error getting account" });
    }
  }
);

module.exports = router;
