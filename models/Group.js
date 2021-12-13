const mongoose = require("mongoose");

const GroupSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  summary: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const Group = mongoose.models.Group || mongoose.model("Group", GroupSchema);

module.exports = Group;
