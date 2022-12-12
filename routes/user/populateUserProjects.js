const Project = require("../../models/project");
const ProjectUser = require("../../models/projectUser");
const UserInfo = require("../../models/userInfo");

async function populateUserProjects(currentUser) {
    const userId = currentUser.id;
    const teamId = currentUser.team?.team_id;
    const role = currentUser.team?.role;

    const user = await UserInfo.findOne({user_id: userId});

    async function assignProjects(projects) {
        user.projects = projects;
        return await user.save();
        
      }
      if (!role) return await assignProjects([]);
      if (role !== "admin") {
        let projects = [];
        const userProjects = await ProjectUser.find({ user_id: userId });
        for (let i in userProjects) {
          projects.push(userProjects[i].project_id);
        }
        return await assignProjects(projects);
       
      }
        let projects = [];
        const teamProjects = await Project.find({ team: teamId });
        for (let i in teamProjects) {
          projects.push(teamProjects[i]._id);
        }
        return await assignProjects(projects);
}

module.exports = populateUserProjects;