const express = require("express");

const {
  createGroup,
  getGroups,
  updateGroup,
  deleteGroup,
} = require("../controllers/group");

const router = express.Router();

router.get("/", getGroups);

router.post("/", createGroup);

router.patch("/:id", updateGroup);

router.delete("/:id", deleteGroup);

module.exports = router;
