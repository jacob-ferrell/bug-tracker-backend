const express = require("express");
const Project = require("../../models/project");
const Ticket = require("../../models/ticket");
const UserInfo = require("../../models/userInfo");
const auth = require("../../verifyJWT");
const getByProjectRole = require("../../utils/getByProjectRole");
const pushNotifications = require("../../utils/pushNotification");

const createTicket = express.Router();

//create new ticket
createTicket.route("/createTicket").post(auth.verifyJWT, async (req, res) => {
  const ticket = req.body;
  const demo = req.user.demo || false;
  const getTakenTitle = async () => {
    return new Promise((resolve) => {
      Project.findById(ticket.project_id)
        .populate("tickets")
        .exec((err, project) => {
          if (err) return console.log(err);
          if (
            project.tickets.find((projTicket) => {
              return projTicket.title == ticket.title;
            })
          ) {
            return resolve(true);
          }
          resolve(false);
        });
    });
  };

  try {
    const projectId = ticket.project_id;
    const role = await auth.getRole(req.user, projectId);
    if (!auth.verifyRole(role, ["tester"])) {
      return res.json({
        failed: true,
        message: "You do not have permission to create tickets",
      });
    }
    if (!auth.verifyRole(role)) {
      ticket.users = [];
    }
    let takenTitle = await getTakenTitle();

    if (takenTitle)
      return res.json({
        failed: true,
        message: "This project already has a ticket with that name",
      });

    const project = await Project.findById(projectId);

    let newTicket = new Ticket({
      ...ticket,
      creator: req.user.id,
      demo
    });
    await newTicket.save();

    project.tickets.push(newTicket._id);
    await project.save();

    let developers = [];

    for (let i in ticket.users) {
      const user = await UserInfo.findOne({ user_id: ticket.users[i] });
      developers.push(user);
    }

    const developerMessage = `You were assigned to '${ticket.title}' in '${project.name}'`;

    const managerMessage = `New ticket '${newTicket.title}' was created in '${project.name}'`;
    const projectManagers = await getByProjectRole(
      projectId,
      "project-manager",
      [req.user.id]
    );
    await pushNotifications(req.user, projectManagers, managerMessage);
    if (developers.length)
      await pushNotifications(req.user, developers, developerMessage);

    return res.json({ message: "Sucessfully created ticket" });
  } catch (err) {
    console.log(err);
    return res.json({ message: "Failed to create ticket" });
  }
});

module.exports = createTicket;
