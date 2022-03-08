const mongoose = require("mongoose");

const GroupSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  summary: { type: String, required: true },
});

const Group = mongoose.models.Group || mongoose.model("Group", GroupSchema);

module.exports = Group;
