const express = require("express");

const {
  createGroup,
  signInToGroup,
  authorise,
  updateGroup,
  deleteGroup,
  refreshToken,
} = require("../controllers/group");

const router = express.Router();

router.get("/refresh", refreshToken);

router.post("/signin", signInToGroup);

router.post("/create", createGroup);

router.patch("/update", authorise, updateGroup);

router.delete("/delete", authorise, deleteGroup);

module.exports = router;
