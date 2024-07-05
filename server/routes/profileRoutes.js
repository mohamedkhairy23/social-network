import express from "express";
import {
  getLoggedInUserProfile,
  createOrUpdateUserProfile,
  getAllProfiles,
  getProfileByID,
  deleteProfile,
  addProfileExperience,
  deleteProfileExperience,
  addProfileEducation,
  deleteProfileEducation,
} from "../controllers/profileController.js";
import auth from "../middlewares/auth.js";
import {
  addProfileEducationValidator,
  addProfileExperienceValidator,
  createOrUpdateProfileValidator,
  deleteProfileEducationValidator,
  deleteProfileExperienceValidator,
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
router.delete("/", auth, deleteProfile);
router.put(
  "/experience",
  auth,
  addProfileExperienceValidator,
  addProfileExperience
);
router.delete(
  "/experience/:exp_id",
  auth,
  deleteProfileExperienceValidator,
  deleteProfileExperience
);
router.put(
  "/education",
  auth,
  addProfileEducationValidator,
  addProfileEducation
);
router.delete(
  "/education/:edu_id",
  auth,
  deleteProfileEducationValidator,
  deleteProfileEducation
);

export default router;
