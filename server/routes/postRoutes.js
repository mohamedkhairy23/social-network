import express from "express";
import auth from "../middlewares/auth.js";
import {
  checkObjectIDValidator,
  createPostValidator,
} from "../utils/validators/postValidator.js";
import {
  createPost,
  deletePostByID,
  getPostByID,
  getPosts,
  likePost,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", auth, createPostValidator, createPost);
router.get("/", auth, getPosts);
router.get("/:id", auth, checkObjectIDValidator, getPostByID);
router.delete("/:id", auth, checkObjectIDValidator, deletePostByID);
router.put("/like/:id", auth, checkObjectIDValidator, likePost);

export default router;
