const ProjectUser = require("../models/projectUser");
const UserInfo = require("../models/userInfo");

async function getByProjectRole(projectId, role, exceptions = []) {
  const projectUsers = await ProjectUser.find({
    project_id: projectId,
    role: role,
    user_id: { $nin: [...exceptions] },
  });

  let users = [];

  for (let i in projectUsers) {
    const userInfo = await UserInfo.findOne({
      user_id: projectUsers[i].user_id,
    });
    users.push(userInfo);
  }

  return users;
}

module.exports = getByProjectRole;
