const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: [true, "Please add a sessionId"],
        unique: true,
        maxlength: [30, "SessionId can not be more than 30 chars"]
    },
    patient: {
        // ilerde ayri bi tablosu olacak
        type: String,
        required: [[true, "Please add a patient name"],],
        maxlength: [30, "Patient name can not be more than 30 chars"]
    },
    drName: {
        // ilerde ayri bi tablosu olacak
        type: String,
        required: [[true, "Please add a patient name"],],
        maxlength: [30, "Dr Name can not be more than 30 chars"]
    },
    ballShape: {
        type: String,
        enum: ['square', 'circle', 'rectangle', 'oval', 'triangleup', 'triangledown', 'diamond'],
        default: 'square'
    },
    direction: {
        type: String,
        enum: ['right', 'left', 'up', 'down'],
        default: 'right'
    },
    ballSpeed: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        default: 5
    },
    isActive: {
        type: Boolean,
        default: false
    },
    hasBallStarted: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Sessions", SessionSchema);
