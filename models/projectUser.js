const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectUserSchema = mongoose.Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    project_id: {type: Schema.Types.ObjectId, ref: 'Project'},
    role: {
        type: String,
        required: true
    },
    demo: {type: Boolean, default: false}

    
}, {timestamps: true});

module.exports = mongoose.model('ProjectUser', projectUserSchema);