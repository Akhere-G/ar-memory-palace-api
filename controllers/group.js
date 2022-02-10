const Group = require("../models/group");
const yup = require("yup");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jsonwebtoken = require("jsonwebtoken");

const GroupSchema = new yup.ObjectSchema({
  name: yup.string().trim().min(4).max(30).required("name is missing"),
  summary: yup.string().trim().min(4).max(300).required("summary is missing"),
  password: yup.string().trim().min(4).max(30).required("password is missing"),
  latitude: yup.number().required("latitdude is missing"),
  longitude: yup.number().required("longitude is missing"),
});

const CreateGroupSchema = new yup.ObjectSchema({
  name: yup.string().trim().min(4).max(30).required("name is missing"),
  summary: yup.string().trim().min(4).max(300).required("summary is missing"),
  password: yup.string().trim().min(4).max(30).required("password is missing"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "passwords do not match.")
    .required("confirm password is missing"),
  latitude: yup.number().required("latitdude is missing"),
  longitude: yup.number().required("longitude is missing"),
});

const UpdateGroupSchema = new yup.ObjectSchema({
  name: yup.string().trim().min(4).max(30).required("name is missing"),
  summary: yup.string().trim().min(4).max(300).required("summary is missing"),
  latitude: yup.number().required("latitdude is missing"),
  longitude: yup.number().required("longitude is missing"),
});

module.exports.authorise = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;

    if (!bearerHeader) {
      return res.status(400).json({ message: "Bearer Header is required" });
    }

    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    const tokenData = jwt.verify(bearerToken, process.env.SECRET_KEY);
    const id = tokenData.id;
    req.groupId = id;

    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: `No group with id ${id}` });
    }

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "You need to log into a group to see its notes" });
  }
};

module.exports.refreshToken = async (req, res) => {
  try {
    const bearerHeader = req.headers.authorization;

    if (!bearerHeader) {
      return res.status(400).json({ message: "Bearer Header is required" });
    }

    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    const tokenData = jwt.verify(bearerToken, process.env.SECRET_KEY);
    const id = tokenData.id;

    Group.findById(id);

    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: `No group with id ${id}` });
    }

    const groupData = {
      name: group.name,
      summary: group.summary,
      longitude: group.longitude,
      latitude: group.latitude,
      id: group._id,
    };

    const token = jwt.sign(groupData, process.env.SECRET_KEY, {
      expiresIn: "1y",
    });

    return res.json({ group: groupData, token });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "You need to log into a group to see its notes" });
  }
};

module.exports.signInToGroup = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ message: "name and password are required" });
    }

    const exisitingGroup = await Group.findOne({ name });

    if (!exisitingGroup) {
      return res.status(404).json({ message: "group doesn't exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      exisitingGroup.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const groupData = {
      name: exisitingGroup.name,
      summary: exisitingGroup.summary,
      longitude: exisitingGroup.longitude,
      latitude: exisitingGroup.latitude,
      id: exisitingGroup._id,
    };

    const token = jwt.sign(groupData, process.env.SECRET_KEY, {
      expiresIn: "1y",
    });

    res.status(200).json({ token, group: groupData });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports.createGroup = async (req, res) => {
  try {
    const { name, summary, password, confirmPassword, latitude, longitude } =
      req.body;

    const data = {
      name: name?.trim()?.toLowerCase(),
      summary: summary?.trim()?.toLowerCase(),
      password,
      latitude,
      longitude,
    };

    const exisitingGroup = await Group.findOne({ name: data.name });

    if (exisitingGroup) {
      return res.status(400).json({ message: "This name has been taken" });
    }

    await CreateGroupSchema.validate({
      ...data,
      confirmPassword,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const group = await Group.create({
      ...data,
      password: hashedPassword,
    });

    const groupData = {
      name: group.name,
      summary: group.summary,
      longitude: group.longitude,
      latitude: group.latitude,
      id: group._id,
    };

    const token = jwt.sign(groupData, process.env.SECRET_KEY, {
      expiresIn: "1y",
    });

    res.status(201).json({ token, group: groupData });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

module.exports.updateGroup = async (req, res) => {
  try {
    const { name, summary, latitude, longitude } = req.body;
    const data = {
      name: name?.trim()?.toLowerCase(),
      summary: summary?.trim()?.toLowerCase(),
      latitude,
      longitude,
    };

    const id = req.groupId;

    await UpdateGroupSchema.validate(data);

    const exisitingGroup = await Group.findOne({ name: data.name });

    if (exisitingGroup && exisitingGroup._id != id) {
      return res.status(400).json({ message: "This name has been taken" });
    }

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
    const id = req.groupId;

    const group = await Group.findByIdAndDelete(id);

    if (!group) {
      return res.status(404).json({ message: `No group with id ${id}` });
    }

    res.status(201).json({ message: "success" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
