const express = require("express");
const Project = require("../../models/project");
const Ticket = require("../../models/ticket");
const ProjectUser = require('../../models/projectUser')
const Team = require("../../models/team");
const auth = require("../../verifyJWT");
 
const deleteProject = express.Router();

deleteProject.route("/deleteProject").post(auth.verifyJWT, async (req, res) => {
  if (req.user.team.role != "admin")
      return res.json({
        failed: true,
        message: "Only Team Admins can delete projects",
      });  
  
  try {
      const project = req.body.project_id;
      await Project.deleteOne({ _id: project});
      await ProjectUser.deleteMany({ project_id: project });
      await Ticket.deleteMany({project_id: project});
      const team = await Team.findById(req.user.team.team_id);
      team.projects = team.projects.filter((e) => e != project);
      await team.save();
      return res.json({ success: true });
    } catch (err) {
      console.log(err);
      return res.json({
        failed: true,
        message: "There was an error while deleting the project",
      });
    }
  });

  module.exports = deleteProject;