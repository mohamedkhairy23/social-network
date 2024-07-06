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

const addCommentToPostValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  check("text", "Text is required").not().isEmpty(),
  validatorMiddleware,
];

const updateOrDeleteCommentValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  check("comment_id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

export {
  createPostValidator,
  checkObjectIDValidator,
  addCommentToPostValidator,
  updateOrDeleteCommentValidator,
};
