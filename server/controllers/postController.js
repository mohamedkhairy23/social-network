import asyncHandler from "express-async-handler";
import Post from "../models/postModel.js";
import Profile from "../models/profileModel.js";
import User from "../models/userModel.js";

// @desc     POST Create a post
// @route    POST /api/posts
// @access   Private
const createPost = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    });

    const post = await newPost.save();

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export { createPost };
