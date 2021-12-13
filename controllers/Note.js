const Note = require("../models/Note");
const yup = require("yup");

const NoteSchema = new yup.ObjectSchema({
  title: yup.string().trim().max(30).required("title is missing"),
  category: yup.string().trim().max(30).required("category is missing"),
  text: yup.string().trim().max(250).required("text is missing"),
  owner: yup.string().trim().required("owner is missing"),
  latitude: yup.string().trim().required("latitdude is missing"),
  longitude: yup.string().trim().required("longitude is missing"),
});

module.exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ date: -1 });
    res.status(200).json({ notes, total: notes.length });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports.createNote = async (req, res) => {
  try {
    const { title, category, text, owner, longitude, latitude } = req.body;
    const data = {
      title,
      category,
      text,
      owner,
      longitude,
      latitude,
    };

    await NoteSchema.validate(data);

    const newNote = new Note(data);

    const note = await newNote.save();

    res.status(201).json({ note });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports.updateNote = async (req, res) => {
  try {
    const { title, category, text, owner, longitude, latitude } = req.body;

    const { id } = req.params;

    const data = {
      title,
      category,
      text,
      owner,
      longitude,
      latitude,
    };

    await NoteSchema.validate(data);

    const note = await Note.findByIdAndUpdate(id, data);

    if (!note) {
      return res.status(404).json({ message: `No note with id ${id}` });
    }

    res.status(201).json({ note: { ...data, _id: id } });
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
