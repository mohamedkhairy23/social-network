const express = require("express");
const { signUp, signIn, getMe } = require("../controllers/userController");
const {
  signUpValidator,
  loginValidator,
} = require("../utils/validators/userValidator");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", signUpValidator, signUp);
router.post("/signin", loginValidator, signIn);
router.get("/getme", auth, getMe);

module.exports = router;
