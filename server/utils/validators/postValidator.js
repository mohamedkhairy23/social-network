import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

const createPostValidator = [
  check("text", "Text is required").not().isEmpty(),
  validatorMiddleware,
];

export { createPostValidator };
