import express from "express";
import auth from "../middlewares/auth.js";
import {
  addCommentToPostValidator,
  checkObjectIDValidator,
  createPostValidator,
  updateOrDeleteCommentValidator,
} from "../utils/validators/postValidator.js";
import {
  addCommentToPost,
  createPost,
  deleteComment,
  deletePostByID,
  getPostByID,
  getPosts,
  likePost,
  unlikePost,
  updateComment,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", auth, createPostValidator, createPost);
router.get("/", auth, getPosts);
router.get("/:id", auth, checkObjectIDValidator, getPostByID);
router.delete("/:id", auth, checkObjectIDValidator, deletePostByID);
router.put("/like/:id", auth, checkObjectIDValidator, likePost);
router.put("/unlike/:id", auth, checkObjectIDValidator, unlikePost);
router.post("/comment/:id", auth, addCommentToPostValidator, addCommentToPost);
router.delete(
  "/comment/:id/:comment_id",
  auth,
  updateOrDeleteCommentValidator,
  deleteComment
);
router.put(
  "/comment/:id/:comment_id",
  auth,
  updateOrDeleteCommentValidator,
  updateComment
);

export default router;
