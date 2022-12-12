const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = mongoose.Schema({
    content: String,
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    ticket_id: {type: Schema.Types.ObjectId, ref: 'Ticket'},
    demo: {type: Boolean, default: false}
}, {timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);