const { model, Schema } = require("mongoose");

const taskSchema = new Schema({
  taskId: {
    type: String,
    required: true,
    unique: true,
  },

  taskName: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  assignedStudent: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
});

module.exports = model("Task", taskSchema);