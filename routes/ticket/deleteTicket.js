const express = require("express");
const Ticket = require("../../models/ticket");
const Project = require("../../models/project");
const Comment = require('../../models/comment');
const auth = require("../../verifyJWT");

const deleteTicket = express.Router();

//delete ticket
deleteTicket.route("/deleteTicket").post(auth.verifyJWT, async (req, res) => {

  try {
    const ticketId = req.body.ticket.ticket_id;
    const projectId = req.body.ticket.project_id;
    const project = await Project.findById(projectId);
    project.tickets = project.tickets.filter(ticket => ticket != ticketId);
    await project.save();

    await Comment.deleteMany({ticket_id: ticketId});

    await Ticket.deleteOne({_id: ticketId});

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({
      failed: true,
      message: "There was an error while deleting this ticket",
    });
  }
});

module.exports = deleteTicket;
