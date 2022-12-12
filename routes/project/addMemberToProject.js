const express = require("express");
const Project = require("../../models/project");
const UserInfo = require("../../models/userInfo");
const ProjectUser = require("../../models/projectUser");
const auth = require("../../verifyJWT");
const capitalize = require("../../utils/capitalize");
const pushNotifications = require("../../utils/pushNotification");
const getByProjectRole = require("../../utils/getByProjectRole");

const addMemberToProject = express.Router();

addMemberToProject
  .route("/addMemberToProject")
  .post(auth.verifyJWT, async (req, res) => {
    try {
      const projectId = req.body.project_id;
      const demo = req.user.demo || false;
      const role = await auth.getRole(req.user, projectId);
      if (!auth.verifyRole(role))
        return res.json({
          failed: true,
          message: "You do not have permission to add users to the project",
        });
      const user = await UserInfo.findOne({ user_id: req.body.user_id });
      user.projects.push(projectId);

      const projectUser = new ProjectUser({ ...req.body, demo });
      await projectUser.save();

      const project = await Project.findById(projectId);
      project.users.push(projectUser._id);
      await project.save();

      const userMessage = `You were added to '${
        project.name
      }' as a ${capitalize(projectUser.role)}`;

      await pushNotifications(req.user, [user], userMessage);

      const managersMessage = `${capitalize(user.firstName)} ${capitalize(
        user.lastName
      )} was added to '${project.name}'`;

      const projectManagers = await getByProjectRole(
        projectId,
        "project-manager",
        [req.user.id, user.user_id]
      );
      await pushNotifications(req.user, projectManagers, managersMessage);

      return res.json({ success: true });
    } catch (err) {
      console.log(err);
    }
  });

module.exports = addMemberToProject;
