const express = require("express");
const { signUp, signIn } = require("../controllers/userController");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("From Posts");
});

module.exports = router;
