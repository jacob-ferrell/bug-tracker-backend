const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = mongoose.Schema(
  {
    message: String,
    project_id: { type: Schema.Types.ObjectId, ref: "Project" },
    team_id: { type: Schema.Types.ObjectId, ref: "Team" },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    ticket_id: { type: Schema.Types.ObjectId, ref: "Ticket" },
    demo: {type: Boolean, default: false}

  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
