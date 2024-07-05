import express from "express";
import {
  getLoggedInUserProfile,
  createOrUpdateUserProfile,
  getAllProfiles,
  getProfileByID,
} from "../controllers/profileController.js";
import auth from "../middlewares/auth.js";
import {
  createOrUpdateProfileValidator,
  getProfileByUserIDValidator,
} from "../utils/validators/profileValidator.js";

const router = express.Router();

router.get("/", getAllProfiles);
router.get("/user/:user_id", getProfileByUserIDValidator, getProfileByID);
router.get("/me", auth, getLoggedInUserProfile);
router.post(
  "/",
  auth,
  createOrUpdateProfileValidator,
  createOrUpdateUserProfile
);

export default router;
