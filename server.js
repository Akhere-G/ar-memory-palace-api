const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const noteRoutes = require("./routes/notes");
const groupsRoutes = require("./routes/groups");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CONNECTION_URL = process.env.CONNECTION_URL;

const PORT = process.env.PORT || 5000;

app.use("/api/notes", noteRoutes);
app.use("/api/groups", groupsRoutes);

app.use("/", (req, res) => res.send("Welcone to the memory palace api!"));

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Listening at port ${PORT}`)))
  .catch((err) => console.log(`Could not connect. ${err.message}`));
