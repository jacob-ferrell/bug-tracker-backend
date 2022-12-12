const jwt = require("jsonwebtoken");
const TeamMember = require("./models/teamMember");
const ProjectUser = require("./models/projectUser");

function verifyJWT(req, res, next) {
  const token = req.headers["x-access-token"]?.split(" ")[1];
  if (!token) {
    return res.json({ message: "Incorrect Token Given", isLoggedIn: false });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err)
      return res.json({
        isLoggedIn: false,
        message: "Failed To Authenticate",
      });
    req.user = {};
    req.user.id = decoded.id;
    req.user.email = decoded.email;
    const teamMember = await TeamMember.findOne({ user_id: req.user.id });
    if (teamMember?.demo) req.user.demo = true;
    if (teamMember) {
      req.user.team = {
        team_id: teamMember.team_id,
        role: teamMember.role,
      };
    }
    next();
  });
}

async function getRole(user, projectId) {
  const teamRole = user.team.role;
  if (teamRole === "admin") return teamRole;
  const projectUser = await ProjectUser.findOne({
    user_id: user.id,
    project_id: projectId,
  });
  return projectUser.role;
}

function verifyRole(role, permittedRoles = []) {
  return ["admin", "project-manager", ...permittedRoles].includes(role);
}

module.exports = { verifyJWT, getRole, verifyRole };
