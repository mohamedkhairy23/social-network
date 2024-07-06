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
      .sort({ date: -1 })
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

// @desc     GET get post by ID
// @route    GET /api/posts/:id
// @access   Private
const getPostByID = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post with that id not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post with that id not found" });
    }
    res.status(500).json({ message: "Something went wrong" });
  }
});

// @desc     DELETE delete post by ID
// @route    DELETE /api/posts/:id
// @access   Private
const deletePostByID = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post with that id not found" });
    }

    // Check if post owner is logged in
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.deleteOne();

    res.status(200).json({ msg: "Post Removed" });
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post with that id not found" });
    }
    res.status(500).json({ message: "Something went wrong" });
  }
});

// @desc     PUT Like a post by post ID
// @route    DELETE /api/posts/like/:id
// @access   Private
const likePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    // pushing logged in user like
    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.status(200).json(post.likes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// @desc     PUT UnLike a post by post ID
// @route    DELETE /api/posts/like/:id
// @access   Private
const unlikePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has not yet been liked
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    // remove the like
    post.likes = post.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );
    await post.save();

    res.status(200).json(post.likes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// @desc     POST Comment on a post
// @route    POST /api/posts/comment/:id
// @access   Private
const addCommentToPost = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const post = await Post.findById(req.params.id);

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    };

    post.comments.unshift(newComment);

    await post.save();

    res.status(200).json(post.comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// @desc     DELETE delete comment by post ID and comment ID
// @route    DELETE /api/posts/comment/:id/:comment_id
// @access   Private
const deleteComment = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: "Comment doesn't exist" });
    }

    // check if logged in user is the owner of a comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    post.comments = post.comments.filter(
      (comment) => comment.id !== req.params.comment_id
    );

    await post.save();

    return res.json(post.comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// @desc     PUT update comment by post ID and comment ID
// @route    PUT /api/posts/comment/:id/:comment_id
// @access   Private
const updateComment = asyncHandler(async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: "Comment doesn't exist" });
    }

    // check if logged in user is the owner of a comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    comment.text = text;

    await post.save();

    return res.json(post.comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export {
  createPost,
  getPosts,
  getPostByID,
  deletePostByID,
  likePost,
  unlikePost,
  addCommentToPost,
  deleteComment,
  updateComment,
};
