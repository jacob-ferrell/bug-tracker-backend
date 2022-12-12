const express = require("express");
const UserInfo = require("../../models/userInfo");

const auth = require("../../verifyJWT");

const findUser = express.Router();

//find a user by email and return user_id
findUser.route("/findUser").post(auth.verifyJWT, async (req, res) => {
    const userToAdd = await UserInfo.findOne({ email: req.body.email });
    if (!userToAdd) {
      return res.json({ failed: true, message: "Failed to find user" });
    }
    return res.json({ ...userToAdd._doc });
  });

  module.exports = findUser;