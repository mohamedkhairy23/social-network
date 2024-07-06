import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

const getPostByIDValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

const deletePostByIDValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

const createPostValidator = [
  check("text", "Text is required").not().isEmpty(),
  validatorMiddleware,
];

export { createPostValidator, getPostByIDValidator, deletePostByIDValidator };
