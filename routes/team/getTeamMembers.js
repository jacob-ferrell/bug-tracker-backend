const express = require("express");
const UserInfo = require("../../models/userInfo");
const TeamMember = require("../../models/teamMember");
const auth = require("../../verifyJWT");

const getTeamMembers = express.Router();

//get all team member data
getTeamMembers.route("/getTeamMembers").get(auth.verifyJWT, async (req, res) => {
    try {
      const user = await UserInfo.findOne({ user_id: req.user.id });
      if (!user.team) return res.json({ noTeam: true });
      const teamId = user.team;
      const teamMembers = await TeamMember.find({ team_id: teamId });
      let memberData = teamMembers.map((e) => {
        return {
          role: e.role,
          user_id: e.user_id,
        };
      });
      for (let i in memberData) {
        const member = memberData[i];
        const userInfo = await UserInfo.findOne({ user_id: member.user_id });
        member.name = userInfo.firstName + " " + userInfo.lastName;
        member.email = userInfo.email;
      }
      return res.json(memberData);
    } catch (err) {
      console.log(err);
    }
  });

  module.exports = getTeamMembers;