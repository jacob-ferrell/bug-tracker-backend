const express = require("express");
const Ticket = require("../../models/ticket");
const Comment = require("../../models/comment");
const UserInfo = require("../../models/userInfo");
const Project = require("../../models/project");
const ProjectUser = require("../../models/projectUser");
const auth = require("../../verifyJWT");
const capitalize = require("../../utils/capitalize");
const getByProjectRole = require("../../utils/getByProjectRole");
const pushNotifications = require("../../utils/pushNotification");

const createComment = express.Router();

//create new comment
createComment.route("/createComment").post(auth.verifyJWT, async (req, res) => {
  try {
    const commenter = await UserInfo.findOne({ user_id: req.user.id });
    const demo = req.user.demo || false;
    const commenterName =
      capitalize(commenter.firstName) + " " + capitalize(commenter.lastName);

    const comment = new Comment({
      ...req.body,
      creator: req.user.id,
      demo
    });
    await comment.save();

    const ticket = await Ticket.findById(req.body.ticket_id);
    ticket.comments.push(comment._id);
    await ticket.save();

    const project = await Project.findById(ticket.project_id);

    let developers = [];
    for (let i in ticket.users) {
      if (ticket.users[i] == req.user.id) continue;
      const developer = await UserInfo.findOne({
        user_id: ticket.users[i],
      });
      developers.push(developer);
    }
    const ticketCreator = await UserInfo.findOne({
      project_id: project._id,
      user_id: ticket.creator,
    });

    if (ticketCreator && ticketCreator.user_id != req.user.id) {
      developers.push(ticketCreator);
    }

    const message = `${commenterName} commented on '${ticket.title}' in '${project.name}'`;
    const projectManagers = await getByProjectRole(
      project._id,
      "project-manager",
      [req.user.id]
    );
    await pushNotifications(req.user, [...projectManagers, ...developers], message);

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({ failed: true, message: "Failed to create comment" });
  }
});

module.exports = createComment;
