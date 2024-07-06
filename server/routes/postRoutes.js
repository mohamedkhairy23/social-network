import express from "express";
import auth from "../middlewares/auth.js";
import { createPostValidator } from "../utils/validators/postValidator.js";
import { createPost, getPosts } from "../controllers/postController.js";

const router = express.Router();

router.post("/", auth, createPostValidator, createPost);
router.get("/", auth, getPosts);

export default router;
