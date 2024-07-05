import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

const getProfileByUserIDValidator = [
  check("user_id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

const deleteProfileExperienceValidator = [
  check("exp_id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

const createOrUpdateProfileValidator = [
  check("status", "Status is required").not().isEmpty(),
  check("skills", "Skills are required").not().isEmpty(),
  validatorMiddleware,
];

const addProfileExperienceValidator = [
  check("title", "Title is required").not().isEmpty(),
  check("company", "Company is required").not().isEmpty(),
  check("from", "From date is required").not().isEmpty(),
  validatorMiddleware,
];

export {
  createOrUpdateProfileValidator,
  getProfileByUserIDValidator,
  addProfileExperienceValidator,
  deleteProfileExperienceValidator,
};
