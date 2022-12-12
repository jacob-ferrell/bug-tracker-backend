const express = require("express");
const UserInfo = require("../../models/userInfo");
const Notification = require("../../models/notification");

const auth = require("../../verifyJWT");

const getNotifications = express.Router();

getNotifications
  .route("/getNotifications")
  .get(auth.verifyJWT, async (req, res) => {
    const userId = req.user.id;

    try {
      const user = await UserInfo.findOne({ user_id: userId });
      const notifications = user.notifications;
      let userNotifications = [];
      for (let i in notifications) {
        const id = notifications[i].notification_id;
        const notificationCollection = await Notification.findById(id);
        userNotifications.push({
          message: notificationCollection.message,
          project_id: notificationCollection.project_id,
          creator: notificationCollection.creator,
          ticket_id: notificationCollection.ticket_id,
          createdAt: notificationCollection.createdAt,
          unread: notifications[i].unread || false,
        });
      }
      return res.json([
        ...userNotifications.sort(
          (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        ),
      ]);
    } catch (err) {
      console.log(err);
    }
  });

module.exports = getNotifications;
