import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const auth = asyncHandler(async (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if token is not present
  if (!token) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
});

export default auth;
