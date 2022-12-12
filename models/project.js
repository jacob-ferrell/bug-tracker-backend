const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = mongoose.Schema({
    name: String,
    description: String,
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    tickets: [{type: Schema.Types.ObjectId, ref: 'Ticket'}],
    users: [{type: Schema.Types.ObjectId, ref: 'ProjectUser'}],
    team: {type: Schema.Types.ObjectId, ref: 'Team'},
    demo: {type: Boolean, default: false}


}, {timestamps: true});

module.exports = mongoose.model('Project', projectSchema);