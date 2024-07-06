import express from "express";
import auth from "../middlewares/auth.js";
import { createPostValidator } from "../utils/validators/postValidator.js";
import { createPost } from "../controllers/postController.js";

const router = express.Router();

router.post("/", auth, createPostValidator, createPost);

export default router;
