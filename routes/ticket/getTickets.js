const express = require("express");
const Project = require("../../models/project");
const ProjectUser = require("../../models/projectUser");
const auth = require("../../verifyJWT");

const getTickets = express.Router();

//get all tickets associated with user's projects
getTickets.route("/getTickets").get(auth.verifyJWT, async (req, res) => {
    const getProjectIds = async () => {
      return new Promise((resolve) => {
        ProjectUser.find({ user_id: req.user.id }).exec((err, projUsers) => {
          resolve(projUsers.map((e) => e.project_id));
        });
      });
    };
  
    try {
      const projectIds = await getProjectIds();
      Project.find({
        _id: { $in: projectIds },
      })
        .populate("tickets")
        .exec((err, projects) => {
          let tickets = [];
          for (let i in projects) {
            let project = projects[i];
            if (project.tickets.length) {
              tickets = tickets.concat(project.tickets);
            }
          }
          return res.json({ tickets });
        });
    } catch (err) {
      console.log(err);
    }
  });

  module.exports = getTickets;