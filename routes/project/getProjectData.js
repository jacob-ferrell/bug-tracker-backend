const express = require("express");
const Ticket = require("../../models/ticket");
const UserInfo = require("../../models/userInfo");
const ProjectUser = require("../../models/projectUser");
const auth = require("../../verifyJWT");
const populateUserProjects = require("../user/populateUserProjects");

 
const getProjectData = express.Router();

getProjectData.route("/getProjectData").get(auth.verifyJWT, async (req, res) => {
    try {
      await populateUserProjects(req.user);
      UserInfo.findOne({ user_id: req.user.id })
        .populate("projects")
        .exec(async (err, user) => {
          if (err) return console.log(err);
          const projects = user.projects.map((project) => {
            return {
              name: project.name,
              project_id: project._id,
              tickets: project.tickets,
              description: project.description,
              createdAt: project.createdAt,
            };
          });
          for (let i in projects) {
            const project = projects[i];
            const projectUser = await ProjectUser.findOne({
              user_id: req.user.id,
              project_id: project.project_id,
            });
            project.role = projectUser?.role || req.user.team.role;
  
            const tickets = await Ticket.find({
              _id: { $in: project.tickets },
            });
  
            for (let i in tickets) {
              tickets[i] = { ...tickets[i]._doc };
              const ticket = tickets[i];
              const creator = await UserInfo.findOne({ user_id: ticket.creator });
              ticket.creator = {
                id: creator.user_id,
                name: creator.firstName + " " + creator.lastName,
              };
              const users = [];
              for (let i in ticket.users) {
                const id = ticket.users[i];
                users.push(id);
              }
              ticket.users = users;
            }
  
            project.tickets = tickets;
  
            const users = await ProjectUser.find({
              project_id: project.project_id,
            });
            for (let i in users) {
              const userInfo = await UserInfo.findOne({
                user_id: users[i].user_id,
              });
              users[i] = {
                role: users[i].role,
                name: userInfo.firstName + " " + userInfo.lastName,
                email: userInfo.email,
                user_id: users[i].user_id,
              };
            }
            project.users = users;
          }
          res.json([...projects]);
        });
    } catch (err) {
      console.log(err);
    }
  });

  module.exports = getProjectData;