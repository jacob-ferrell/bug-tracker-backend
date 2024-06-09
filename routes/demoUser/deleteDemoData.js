const Project = require("../../models/project");
const Ticket = require("../../models/ticket");
const Comment = require("../../models/comment");
const Team = require("../../models/team");
const Notification = require("../../models/notification");
const ProjectUser = require("../../models/projectUser");
const UserInfo = require("../../models/userInfo");
const TeamMember = require("../../models/teamMember");
const User = require("../../models/user");
const auth = require("../../verifyJWT");

const express = require("express");

const deleteDemoData = express.Router();

deleteDemoData.route("/deleteDemoData").get(async (req, res) => {
  const models = [
    Project,
    Ticket,
    Comment,
    Team,
    Notification,
    ProjectUser,
    UserInfo,
    TeamMember,
    User,
  ];

  try {
    for (let i in models) {
      await models[i].deleteMany({ demo: true });
    }
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({ failed: true, message: "Failed to create team" });
  }
});

module.exports = deleteDemoData;
