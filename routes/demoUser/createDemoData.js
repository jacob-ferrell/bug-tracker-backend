const Project = require("../../models/project");
const Ticket = require("../../models/ticket");
const Comment = require('../../models/comment')
const Team = require("../../models/team");
const Notification = require('../../models/notification');
const ProjectUser = require('../../models/projectUser');
const UserInfo = require("../../models/userInfo");
const TeamMember = require("../../models/teamMember");
const User = require("../../models/user");
const auth = require("../../verifyJWT");
const express = require("express");
const { read } = require("fs");


const createDemoData = express.Router();

createDemoData
  .route("/createDemoData")
  .post(async (req, res) => {
    const emails = req.body.emails;
    try {
      const users = await UserInfo.find({email: {$regex: "Demo"}});
      const user = await UserInfo.findOne({email: req.body.email});
      
      console.log(user)
      const userId = user.user_id;

      let teamMembers = [];
      let userIds = {};
      //create demo team
      const team = new Team({
        name: 'Demo Team',
        creator: userId,
        demo: true,
        members: []
      })
      //add each user whose email is in emails 
      //array to the team and create teamMember collection
      for (let i in emails) {
        const userInfo = await UserInfo.findOne({email: emails[i]});
        teamMembers.push(userInfo);
        if (userInfo.email.includes('Demo_Admin')) userIds.admin = userInfo.user_id;
        userInfo.team = team._id;
        const role = userInfo.lastName === 'Admin' ? 'admin' : 'developer';
        await userInfo.save();
        const teamMember = new TeamMember({
          user_id: userInfo.user_id,
          team_id: team._id,
          role,
          demo: true
        })
        await teamMember.save();
        team.members.push(userInfo.user_id);

      }
      
      //create demo projects
      const companyWebsite = new Project({
        name: "Company Website",
        description: "The main website for our organization",
        creator: userIds.admin,
        team: team._id,
        demo: true,
      })
      await companyWebsite.save();
      team.projects.push(companyWebsite._id);
      //create project users for each non-admin team member
      for (let i in teamMembers) {
        const member = teamMembers[i];
        userIds[member.lastName.toLowerCase()] = member.user_id;
        let role = member.lastName.toLowerCase();
        if (role === 'admin') continue;
        if (member.lastName === 'Manager') role = 'project-manager';
        const projectUser = new ProjectUser({
          user_id: member.user_id,
          project_id: companyWebsite._id,
          demo: true,
          role
        })
        await projectUser.save();
        companyWebsite.users.push(projectUser._id);
      }
      //create tickets
      const toggleTicket = new Ticket({
        title: 'Dark/Light Mode Toggle',
        description: 'The site should have a dark/light mode toggle option',
        creator: userIds.manager,
        project_id: companyWebsite._id,
        priority: 'Medium',
        status: 'open',
        type: 'Feature Request',
        users: [userIds.developer],
        demo: true
      });
      await toggleTicket.save();

      const errorTicket = new Ticket({
        title: 'Cart Error',
        description: "Items do not always successfully clear from the user's cart when they click 'remove from cart'",
        creator: userIds.tester,
        project_id: companyWebsite._id,
        priority: 'High',
        status: 'in progress',
        type: 'Bug Fix',
        users: [userIds.developer],
        demo: true
      })
      await errorTicket.save();

      const mobileTicket = new Ticket ({
        title: 'Mobile Responsiveness',
        description: "The navbar is not properly collapsing on mobile screens",
        creator: userIds.tester,
        project_id: companyWebsite._id,
        priority: 'High',
        status: 'closed',
        type: 'Issue',
        users: [userIds.developer],
        demo: true
      })
      await mobileTicket.save();
      companyWebsite.tickets.push(toggleTicket._id);
      companyWebsite.tickets.push(mobileTicket._id);
      companyWebsite.tickets.push(errorTicket._id);

      //create ticket comments
      const developerCartComment = new Comment({
        content: 'Does this only happen with a specific item?  If so, can you please provide which item?',
        creator: userIds.developer,
        ticket_id: errorTicket._id,
        demo: true
      })
      await developerCartComment.save();
      const testerCartComment = new Comment({
        content: "This happened with several different items.",
        creator: userIds.tester,
        ticket_id: errorTicket._id,
        demo: true
      })
      await testerCartComment.save();
      
      const mobileDeveloperComment = new Comment({
        content: "I've tweaked the CSS, and the navbar now collapses on mobile screens",
        creator: userIds.developer,
        ticket_id: mobileTicket._id,
        demo: true
      })
      await mobileDeveloperComment.save();
      const mobileManagerComment = new Comment({
        content: "Thank you.  Issue appears to have been resolved.  Closing ticket.",
        creator: userIds.manager,
        ticket_id: mobileTicket._id,
        demo: true
      })
      await mobileManagerComment.save();
      mobileTicket.comments.push(mobileManagerComment._id);
      mobileTicket.comments.push(mobileDeveloperComment._id);
      errorTicket.comments.push(developerCartComment._id);
      errorTicket.comments.push(testerCartComment._id);
      await errorTicket.save();
      await mobileTicket.save();
      
      await companyWebsite.save();

      await team.save();

      return res.json({success: true})
    } catch (err) {
      console.log(err);
      return res.json({ failed: true, message: "There was an error while generating demo data" });
    }
  });

module.exports = createDemoData;
