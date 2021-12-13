const express = require("express");

const { 
    createNote,
    getNotes, 
    updateNote, 
    deleteNote 
} = require("../controllers/Note");

const router = express.Router();

router.get("/", getNotes);

router.post("/", createNote);

router.patch("/:id", updateNote);

router.delete("/:id", deleteNote);

module.exports = router;