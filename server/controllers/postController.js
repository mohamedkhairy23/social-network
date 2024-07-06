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

// @desc     GET get all posts
// @route    GET /api/posts
// @access   Private
const getPosts = asyncHandler(async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const page = parseInt(req.query.page) || 1;

    let query = {};

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query = { text: searchRegex };
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const posts = await Post.find(query)
      .populate("user", "name avatar")
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Post.countDocuments(query);

    const response = {
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
      data: posts,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export { createPost, getPosts };
