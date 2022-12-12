const express = require("express");
const Ticket = require("../../models/ticket");
const UserInfo = require("../../models/userInfo");
const auth = require("../../verifyJWT");

const getComments = express.Router();

//get all comments for all tickets for a given project
getComments.route("/getComments").post(auth.verifyJWT, async (req, res) => {
    const projectId = req.body.project_id;
  
    try {
      Ticket.find({ project_id: projectId })
        .populate("comments")
        .exec(async (err, tickets) => {
          let comments = [];
          for (let i in tickets) {
            let ticket = tickets[i];
            if (ticket.comments.length) {
              for (let i in ticket.comments) {
                const comment = { ...ticket.comments[i]._doc };
                const creator = await UserInfo.findOne({
                  user_id: comment.creator,
                });
                comment.creator = {
                  id: creator.user_id,
                  name: creator.firstName + " " + creator.lastName,
                };
                comments.push(comment);
              }
            }
          }
          return res.json([...comments]);
        });
    } catch (err) {
      console.log(err);
      return res.json({ failed: true, message: "Failed to retrieve comments" });
    }
  });

  module.exports = getComments;