import express from "express";
import { signUp, signIn, getMe } from "../controllers/userController.js";
import {
  signUpValidator,
  loginValidator,
} from "../utils/validators/userValidator.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signUpValidator, signUp);
router.post("/signin", loginValidator, signIn);
router.get("/getme", auth, getMe);

export default router;
