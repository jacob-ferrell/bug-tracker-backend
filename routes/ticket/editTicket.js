const express = require("express");
const Ticket = require("../../models/ticket");
const UserInfo = require("../../models/userInfo");
const Project = require("../../models/project");
const auth = require("../../verifyJWT");
const pushNotifications = require("../../utils/pushNotification");

const editTicket = express.Router();

//edit ticket
editTicket.route("/editTicket").post(auth.verifyJWT, async (req, res) => {
  const getNewDevelopers = async (prevDevelopers, curDevelopers) => {
    let developers = [];
    for (let i in curDevelopers) {
      const user = curDevelopers[i];
      if (prevDevelopers.includes(user)) continue;
      const developer = await UserInfo.findOne({ user_id: user });
      developers.push(developer);
    }
    return developers;
  };
  try {
    const newTicket = req.body.ticket;
    delete newTicket.__v;
    delete newTicket.creator;
    const ticketToEdit = await Ticket.findById(newTicket._id);
    const role = await auth.getRole(req.user, ticketToEdit.project_id);
    if (!auth.verifyRole(role) && ticketToEdit.creator !== req.user.id) {
      return res.json({
        failed: true,
        message: "You do not have permission to edit this ticket",
      });
    }
    const project = await Project.findById(ticketToEdit.project_id);

    let developers = await getNewDevelopers(
      ticketToEdit.users,
      newTicket.users
    );
    const developerMessage = `You were assigned to '${newTicket.title}' in '${project.name}'`;

    const keys = Object.keys(newTicket);
    for (let i in keys) {
      ticketToEdit[keys[i]] = newTicket[keys[i]];
    }
    await ticketToEdit.save();

    await pushNotifications(req.user, developers, developerMessage);

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({
      failed: true,
      message: "There was an error while editing this ticket",
    });
  }
});

module.exports = editTicket;
