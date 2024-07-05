import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

const signUpValidator = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password must be at least 6 characters long").isLength({
    min: 6,
  }),
  validatorMiddleware,
];

const loginValidator = [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password must be at least 6 characters long").isLength({
    min: 6,
  }),
  validatorMiddleware,
];

export { signUpValidator, loginValidator };
