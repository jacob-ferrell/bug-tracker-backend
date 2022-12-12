const mongoose = require('mongoose');
const { Schema } = mongoose;


const teamSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [{type: Schema.Types.ObjectId, ref: 'User'}],
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    projects: [{type: Schema.Types.ObjectId, ref: 'Project'}],
    demo: {type: Boolean, default: false}

}, {timestamps: true});

module.exports = mongoose.model('Team', teamSchema);