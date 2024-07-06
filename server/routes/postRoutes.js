import express from "express";
import auth from "../middlewares/auth.js";
import {
  createPostValidator,
  deletePostByIDValidator,
  getPostByIDValidator,
} from "../utils/validators/postValidator.js";
import {
  createPost,
  deletePostByID,
  getPostByID,
  getPosts,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", auth, createPostValidator, createPost);
router.get("/", auth, getPosts);
router.get("/:id", auth, getPostByIDValidator, getPostByID);
router.delete("/:id", auth, deletePostByIDValidator, deletePostByID);

export default router;
