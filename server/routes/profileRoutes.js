import express from "express";
import {
  getLoggedInUserProfile,
  createOrUpdateUserProfile,
} from "../controllers/profileController.js";
import auth from "../middlewares/auth.js";
import { createOrUpdateProfileValidator } from "../utils/validators/profileValidator.js";

const router = express.Router();

router.get("/me", auth, getLoggedInUserProfile);
router.post(
  "/",
  auth,
  createOrUpdateProfileValidator,
  createOrUpdateUserProfile
);

export default router;
