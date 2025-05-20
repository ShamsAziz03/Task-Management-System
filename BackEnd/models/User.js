const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  stu_id: {
    type: String,
  },

  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

module.exports = model("User", userSchema);
