const express = require("express");
const { signUp, signIn } = require("../controllers/userController");
const {
  signUpValidator,
  loginValidator,
} = require("../utils/validators/userValidator");

const router = express.Router();

router.post("/signup", signUpValidator, signUp);
router.post("/signin", loginValidator, signIn);

module.exports = router;
