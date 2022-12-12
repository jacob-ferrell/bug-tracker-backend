const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamMemberSchema = mongoose.Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    team_id: {type: Schema.Types.ObjectId, ref: 'Team'},
    role: {
        type: String,
        required: true
    },
    demo: {type: Boolean, default: false}

    
}, {timestamps: true});

module.exports = mongoose.model('TeamMember', teamMemberSchema);