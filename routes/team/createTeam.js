const express = require("express");
const UserInfo = require("../../models/userInfo");
const Team = require("../../models/team");
const TeamMember = require("../../models/teamMember");
const auth = require("../../verifyJWT");

const createTeam = express.Router();

createTeam.route("/createTeam").post(auth.verifyJWT, async (req, res) => {
    const team = req.body;
    const demo = req.user.demo || false;
    team.creator = req.user.id;
    try {
      const user = await UserInfo.findOne({ user_id: req.body.creator });
  
      const newTeam = new Team({ ...team, demo });
      newTeam.members.push(req.body.creator);
      await newTeam.save();
  
      const teamMember = new TeamMember({
        user_id: req.user.id,
        team_id: newTeam._id,
        role: "admin",
        demo
      });
      teamMember.save();
  
      user.team = newTeam._id;
      await user.save();
      return res.json({
        email: user.email,
        user_id: req.user.id,
        name: user.firstName + " " + user.lastName,
        role: teamMember.role,
      });
    } catch (err) {
      console.log(err);
      return res.json({ failed: true, message: "Failed to create team" });
    }
  });

  module.exports = createTeam;