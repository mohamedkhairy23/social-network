const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.signUpValidator = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password must be at least 6 characters long").isLength({
    min: 6,
  }),
  validatorMiddleware,
];

exports.loginValidator = [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password must be at least 6 characters long").isLength({
    min: 6,
  }),
  validatorMiddleware,
];
