module.exports = {
  project: [
    "createProject",
    "editProject",
    "addMemberToProject",
    "removeFromProject",
    "changeProjectRole",
    "getProjectData",
    "deleteProject",
  ],
  team: [
    "addToTeam",
    "changeTeamRole",
    "getTeamMembers",
    "leaveTeam",
    "createTeam",
    "removeFromTeam",
  ],
  ticket: [
    "createTicket",
    "editTicket",
    "createComment",
    "getComments",
    "getTickets",
    "deleteComment",
    "deleteTicket"
  ],
  user: [
    "findUser",
    "isUserAuth",
    "login",
    "signUp",
    "getNotifications",
    "readNotifications",
  ],
  demoUser: [
    "createDemoData",
    "deleteDemoData"
  ]
};
