const express = require("express");
const Project = require("../../models/project");
const Ticket = require("../../models/ticket");
const ProjectUser = require("../../models/projectUser");
const Comment = require("../../models/comment");
const auth = require("../../verifyJWT");
const comment = require("../../models/comment");

const deleteComment = express.Router();

const isCreator = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  return comment.creator === userId;
};

const isManager = async (projectId, userId) => {
  const projectUser = await ProjectUser.findOne({
    user_id: userId,
    project_id: projectId,
  });
};

const isAdmin = (teamRole) => teamRole === "admin";

deleteComment.route("/deleteComment").post(auth.verifyJWT, async (req, res) => {
  const commentId = req.body.comment;
  const projectId = req.body.project;
  const ticketId = req.body.ticket;
  const teamRole = req.user.team.role;
  const userId = req.user.id;
  try {
    if (
      !isAdmin(teamRole) &&
      !isCreator(commentId, userId) &&
      !isManager(projectId, userId)
    ) {
      return res.json({
        failed: true,
        message: "You do not have permission to delete this comment",
      });
    }

    const ticket = await Ticket.findById(ticketId);
    ticket.comments = ticket.comments.filter(e => e!== commentId);
    await ticket.save();

    await comment.deleteOne({_id: commentId});

    return res.json({success: true})

  } catch (err) {
    console.log(err);
    res.json({
      failed: true,
      message: "There was an error while deleting the comment",
    });
  }
});

module.exports = deleteComment;
