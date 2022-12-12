const express = require("express");
const UserInfo = require("../../models/userInfo");
const ProjectUser = require("../../models/projectUser");
const Team = require("../../models/team");
const TeamMember = require("../../models/teamMember");
const Notification = require("../../models/notification");
const capitalize = require("../../utils/capitalize");
const pushNotifications = require("../../utils/pushNotification");
const getByTeamRole = require("../../utils/getByTeamRole");

const auth = require("../../verifyJWT");

const changeTeamRole = express.Router();

//change other user's role in team
changeTeamRole
  .route("/changeTeamRole")
  .post(auth.verifyJWT, async (req, res) => {
    const userId = req.body.user;
    const newRole = req.body.role;

    if (req.user.team.role !== "admin")
      return res.json({
        failed: true,
        message: "Only Admins can change roles within the team",
      });
    try {
      const member = await TeamMember.findOne({ user_id: userId });
      const user = await UserInfo.findOne({ user_id: userId });

      const assignProjects = async (projects) => {
        user.projects = projects;
      };

      member.role = newRole;
      await member.save();

      if (newRole === "admin") {
        const team = await Team.findById(req.user.team.team_id);
        await assignProjects(team.projects);
      }

      if (newRole === "developer") {
        const projects = await ProjectUser.find({ user_id: userId });
        if (!projects) return assignProjects([]);
        let ids = [];
        for (let i in projects) {
          ids.push(projects[i].project_id);
        }
        assignProjects(ids);
      }

      const admins = await getByTeamRole(req.user, "admin", [
        req.user.id,
        userId,
      ]);
      const message =
        capitalize(user.firstName + " " + user.lastName) +
        "'s Team Role was changed to " +
        capitalize(newRole);
      await pushNotifications(req.user, admins, message);

      const userNotification = new Notification({
        creator: req.user.id,
        team_id: req.user.team.id,
        message: "Your Team Role was changed to " + capitalize(newRole),
      });
      await userNotification.save();

      user.notifications.push({ notification_id: userNotification._id });
      await user.save();

      return res.json({ success: true });
    } catch (err) {
      console.log(err);
      return res.json({ failed: true, message: "Failed to change role" });
    }
  });

module.exports = changeTeamRole;
