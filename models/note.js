const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema({
  title: { type: String, required: true },
  groupId: { type: String, required: true },
  text: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

module.exports = Note;
