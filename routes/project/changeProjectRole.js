const express = require("express");
const ProjectUser = require("../../models/projectUser");
const UserInfo = require("../../models/userInfo");
const Project = require("../../models/project");
const getByProjectRole = require("../../utils/getByProjectRole");
const auth = require("../../verifyJWT");
const pushNotifications = require("../../utils/pushNotification");
const capitalize = require("../../utils/capitalize");

const changeProjectRole = express.Router();

changeProjectRole
  .route("/changeProjectRole")
  .post(auth.verifyJWT, async (req, res) => {
    const userId = req.body.user;
    const projectId = req.body.project;

    try {
      const role = await auth.getRole(req.user, projectId);
      if (!auth.verifyRole(role))
        return res.json({
          failed: true,
          message: "You do not have permission to change project roles",
        });

      const project = Project.findById(projectId);

      const projectUser = await ProjectUser.findOne({
        project_id: projectId,
        user_id: userId,
      });
      projectUser.role = req.body.role;
      await projectUser.save();

      const managers = await getByProjectRole(projectId, "project-manager", [
        req.user.id,
      ]);

      const user = await UserInfo.findOne({ user_id: userId });

      const managerMessage = `${capitalize(user.firstName)} ${capitalize(
        user.lastName
      )}'s role in '${project.name}' was changed to ${capitalize(
        projectUser.role
      )}'`;

      const userMessage = `Your role in '${project.name}' was changed to ${capitalize(
        projectUser.role
      )}'`;

      await pushNotifications(req.user, managers, managerMessage);
      await pushNotifications(req.user, [user], userMessage);

      return res.json({ success: true });
    } catch (err) {
      console.log(err);
      res.json({
        failed: true,
        message: "There was an error while changing the user's project role",
      });
    }
  });

module.exports = changeProjectRole;
