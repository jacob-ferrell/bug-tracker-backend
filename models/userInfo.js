const mongoose = require('mongoose');
const Project = require('./project');
const { Schema } = mongoose;


const userInfoSchema = mongoose.Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    email: String,
    firstName: String,
    lastName: String,
    projects: [{type: Schema.Types.ObjectId, ref: 'Project'}],
    team: {type: Schema.Types.ObjectId, ref: 'Team'},
    notifications: [{
        notification_id: {type: Schema.Types.ObjectId, ref: 'Notification'},
        unread: { type: Boolean, default: true },
    }],
    demo: {type: Boolean, default: false}

    
}, {timestamps: true});

module.exports = mongoose.model('UserInfo', userInfoSchema);