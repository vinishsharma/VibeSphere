import Post from '../models/post.model.js'
import User from '../models/user.model.js';

const createPost = async (req, res) => {
  try {
    const { caption, media, tags } = req.body;
    const userId = req.user.id; // Assuming `req.user` is populated via authentication middleware

    if (!media || media.length === 0) {
      return res.status(400).json({ message: "At least one media file is required." });
    }

    const newPost = new Post({
      user: userId,
      caption,
      media,
      tags,
    });

    const createdPost = await newPost.save();

    //Adding created post's ID in posts array of loggedIn user
    await User.findByIdAndUpdate(userId, { $push: { posts: createdPost._id } });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

const getPostsByIds = async (req, res) => {
  try {
    const { postIds } = req.body;
    const posts = await Post.find({ _id: { $in: postIds } }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "User Posts fetched successfully",
      posts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching user's posts",
      success: false
    });
  }
}

//Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      success: true,
      message: "Successfully fetched all posts",
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};

const getAllPostsExceptMy = async (req, res) => {
  try {
    const myId = req.user.id; // Get logged-in user's ID

    const posts = await Post.find({ user: { $ne: myId } }) // Exclude user's own posts
      // .populate("user", "name username ") // Populate user details
      .sort({ createdAt: -1 }); // Sort by latest posts

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching all posts except my"
    });
  }
};

export { createPost, getPostsByIds, getAllPosts, getAllPostsExceptMy }