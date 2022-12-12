const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    demo: {type: Boolean, default: false}

}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);