const express = require("express");

const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/note");

const { authorise } = require("../controllers/group");

const router = express.Router();

router.use(authorise);

router.get("/", getNotes);

router.post("/", createNote);

router.patch("/:id", updateNote);

router.delete("/:id", deleteNote);

module.exports = router;
