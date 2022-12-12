const express = require("express");
const User = require("../../models/user");
const UserInfo = require("../../models/userInfo");
const bcrypt = require("bcrypt");

const signUp = express.Router();

//create new users
signUp.route("/signup").post(async (req, res) => {
  const user = req.body;
  const demo = user.demo || false;
  const takenEmail = await User.findOne({ email: user.email });


  if (!takenEmail) {
    user.password = await bcrypt.hash(user.password, 10);

    const dbUser = new User({
      password: user.password,
      email: user.email,
      demo
    });

    dbUser.save((err, dbUser) => {
      const dbUserInfo = new UserInfo({
        firstName: user.firstName,
        lastName: user.lastName,
        user_id: dbUser._id,
        email: user.email,
        demo
      });
      dbUserInfo.save();
    });
    return res.json({ takenEmail: false });
  }
  return res.json({ takenEmail: true });
});
module.exports = signUp;