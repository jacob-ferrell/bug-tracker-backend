const express = require("express");
const Project = require("../../models/project");
const UserInfo = require("../../models/userInfo");
const ProjectUser = require("../../models/projectUser");

const auth = require("../../verifyJWT");

const isUserAuth = express.Router();

isUserAuth.route("/isUserAuth").get(auth.verifyJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await UserInfo.findOne({ user_id: userId });
    if (!user) return res.json({ failed: true, isLoggedIn: false });

    return res.json({
      isLoggedIn: true,
      ...user._doc,
      team: { ...req.user.team },
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = isUserAuth;
