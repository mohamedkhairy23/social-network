import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

const checkObjectIDValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

const createPostValidator = [
  check("text", "Text is required").not().isEmpty(),
  validatorMiddleware,
];

export { createPostValidator, checkObjectIDValidator };
