const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  students: [String],
  category: String,
  progress: Number,
  startDate: String,
  endDate: String,
});

module.exports = mongoose.model('Project', projectSchema);
