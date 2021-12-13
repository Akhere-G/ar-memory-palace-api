const Group = require("../models/Group");
const yup = require("yup");

const GroupSchema = new yup.ObjectSchema({
  name: yup.string().trim().max(30).required("name is missing"),
  category: yup.string().tr.max(30).required("category is missing"),
  summary: yup.string().trim().max(300).required("summary is missing"),
  latitude: yup.number().required("latitdude is missing"),
  longitude: yup.number().required("longitude is missing"),
});

module.exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json({ groups, total: groups.length });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports.createGroup = async (req, res) => {
  try {
    const { name, category, summary, latitude, longitude } = req.body;
    const data = {
      name: name?.trim(),
      category: category?.trim(),
      summary: summary?.trim(),
      latitude,
      longitude,
    };

    const exisitingGroup = await Group.findOne({ name: data.name });

    if (exisitingGroup) {
      return res.status(400).json({ message: "This name has been taken" });
    }

    await GroupSchema.validate(data);

    const newGroup = new Group(data);

    const group = await newGroup.save();

    res.status(201).json({ group });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports.updateGroup = async (req, res) => {
  try {
    const { name, category, summary, latitude, longitude } = req.body;
    const data = {
      name: name?.trim(),
      category: category?.trim(),
      summary: summary?.trim(),
      latitude,
      longitude,
    };

    const { id } = req.params;

    await GroupSchema.validate(data);

    const group = await Group.findByIdAndUpdate(id, data);

    if (!group) {
      return res.status(404).json({ message: `No group with id ${id}` });
    }

    res.status(201).json({ group: { ...data, _id: id } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await Group.findByIdAndDelete(id);

    if (!group) {
      return res.status(404).json({ message: `No group with id ${id}` });
    }

    res.status(201).json({ message: "success" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
