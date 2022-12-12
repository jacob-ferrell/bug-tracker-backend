const express = require("express");
const UserInfo = require("../../models/userInfo");

const auth = require("../../verifyJWT");

const readNotifications = express.Router();

readNotifications
  .route("/readNotifications")
  .get(auth.verifyJWT, async (req, res) => {
    const userId = req.user.id;

    try {
      const user = await UserInfo.findOne({ user_id: userId });
      const notifications = user.notifications;
      for (let i in notifications) {
        notifications[i].unread = false;
      }
      await user.save();
      return res.json({success: true});
      
    } catch (err) {
      console.log(err);
    }
  });

module.exports = readNotifications;
