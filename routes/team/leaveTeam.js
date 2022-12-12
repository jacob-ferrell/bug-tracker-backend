const express = require("express");
const UserInfo = require("../../models/userInfo");
const Team = require("../../models/team");
const TeamMember = require("../../models/teamMember");
const auth = require("../../verifyJWT");

const leaveTeam = express.Router();

//leave user's own team
leaveTeam.route("/leaveTeam").get(auth.verifyJWT, async (req, res) => {
    const teamId = req.user.team.team_id;
    try {
      const user = await UserInfo.findOne({ user_id: req.user.id });
      user.team = undefined;
      await user.save();
  
      await TeamMember.deleteOne({ user_id: req.user.id });
      const otherMembers = await TeamMember.find({ team_id: teamId });
      if (!otherMembers) {
        await Team.deleteOne({ _id: teamId });
        return res.json({ success: true });
      }
      const team = await Team.findById(teamId);
      team.members = team.members.filter((userId) => userId != req.user.id);
      await team.save();
      return res.json({ success: true });
    } catch (err) {
      console.log(err);
      return res.json({ failed: true, message: "Failed to leave team" });
    }
  });

  module.exports = leaveTeam;