import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

const createOrUpdateProfileValidator = [
  check("status", "Status is required").not().isEmpty(),
  check("skills", "Skills are required").not().isEmpty(),
  validatorMiddleware,
];

export { createOrUpdateProfileValidator };
