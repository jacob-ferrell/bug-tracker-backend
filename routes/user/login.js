const express = require("express");
const User = require("../../models/user");
const UserInfo = require("../../models/userInfo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = express.Router();

login.route("/login").post(async (req, res) => {
    const userLoggingIn = req.body;
    const userData = await UserInfo.findOne({ email: req.body.email });
  
    User.findOne({ email: userLoggingIn.email }).then((dbUser) => {
      if (!dbUser) {
        return res.json({
          message: "Invalid Email or Password",
          isLoggedIn: false,
        });
      }
      bcrypt
        .compare(userLoggingIn.password, dbUser.password)
        .then((isCorrect) => {
          if (!isCorrect) {
            return res.json({
              message: "Invalid Email or Password",
              isLoggedIn: false,
            });
          }
          const payload = {
            id: dbUser._id,
            email: dbUser.email,
          };
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 86400 },
            (err, token) => {
              if (err) return res.json({ message: err });
              return res.json({
                message: "Success",
                userData: { ...userData._doc },
                token: "Bearer " + token,
              });
            }
          );
        });
    });
  });

  module.exports = login;