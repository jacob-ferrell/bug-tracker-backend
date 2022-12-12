const express = require("express");
const Project = require("../../models/project");
const ProjectUser = require("../../models/projectUser");
const auth = require("../../verifyJWT");
 
const editProject = express.Router();

editProject.route("/editProject").post(auth.verifyJWT, async (req, res) => {
    const project = req.body;
    const projectId = project.project_id;
    const getTakenName = async () => {
      return new Promise((resolve) => {
        Project.find({ _id: { $ne: projectId }, name: project.name })
          .populate("users")
          .exec((err, project) => {
            if (err) return console.log(err);
            for (let i in project) {
              let sameName = project[i];
              if (
                sameName.users.find((user) => {
                  return user.user_id == req.user.id;
                })
              ) {
                return resolve(true);
              }
            }
            resolve(false);
          });
      });
    };
    try {
      const takenName = await getTakenName();
      if (takenName)
        return res.json({
          failed: true,
          message: "You already have a project with that name",
        });
  
      const toEdit = await Project.findById(projectId);
      toEdit.name = project.name;
      toEdit.description = project.description;
      await toEdit.save();
  
      const projectUser = await ProjectUser.findOne({
        project_id: toEdit._id,
        user_id: req.user.id,
      });
      const role = projectUser.role;
      return res.json({
        project: {
          ...toEdit._doc,
          role,
        },
      });
    } catch (err) {
      console.log(err);
    }
  });

  module.exports = editProject;