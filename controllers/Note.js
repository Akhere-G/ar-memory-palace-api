const Note = require("../models/note");
const Group = require("../models/group");
const yup = require("yup");

const NoteSchema = new yup.ObjectSchema({
  title: yup.string().trim().max(30).required("title is missing"),
  groupId: yup.string().trim().max(30).required("group id is missing"),
  category: yup.string().trim().max(30).required("category is missing"),
  text: yup.string().trim().max(250).required("text is missing"),
  latitude: yup.number().required("latitdude is missing"),
  longitude: yup.number().required("longitude is missing"),
});

module.exports.getNotes = async (req, res) => {
  const groupId = req.headers.groupid;
  console.log("l", groupId, req.headers);
  try {
    const notes = await Note.find({ groupId });
    res.status(200).json({ notes, total: notes.length });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports.createNote = async (req, res) => {
  try {
    const { title, groupId, category, text, longitude, latitude } = req.body;
    const data = {
      title: title?.trim(),
      groupId,
      category: category?.trim(),
      text: text?.trim(),
      longitude,
      latitude,
    };

    await NoteSchema.validate(data);

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: `No group with id ${id}` });
    }

    const newNote = new Note(data);

    const note = await newNote.save();

    res.status(201).json({ note });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports.updateNote = async (req, res) => {
  try {
    const { title, groupId, category, text, longitude, latitude } = req.body;
    const data = {
      title: title?.trim(),
      groupId,
      category: category?.trim(),
      text: text?.trim(),
      longitude,
      latitude,
    };

    const { id } = req.params;

    await NoteSchema.validate(data);

    delete data.groupId;

    const note = await Note.findByIdAndUpdate(id, data);

    if (!note) {
      return res.status(404).json({ message: `No note with id ${id}` });
    }

    res.status(201).json({ note: { ...data, id } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports.deleteNote = async (req, res) => {
  try {
    const id = req.params.id;

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({ message: `No note with id ${id}` });
    }
    res.status(200).json({ note });
  } catch (err) {
    res.status(400).json(err);
  }
};
