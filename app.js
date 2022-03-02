const express = require("express");
const cors = require("cors");
const noteRoutes = require("./routes/notes");
const groupsRoutes = require("./routes/groups");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/notes", noteRoutes);
app.use("/api/groups", groupsRoutes);

app.use("/", (_, res) => res.send("Welcome to the memory palace api!"));

module.exports = app;
