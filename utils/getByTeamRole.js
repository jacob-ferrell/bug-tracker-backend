const TeamMember = require('../models/teamMember');

async function getByTeamRole (user, role, exceptions = []) {
    const members = await TeamMember.find({
        team_id: user.team.team_id,
        role: role,
        user_id: { $nin: [...exceptions]},
      });
      return members;
}

module.exports = getByTeamRole;