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

//Get all uploaded posts of logged-in user
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

//Get all liked posts of logged-in user
const getLikedPostsByIds = async (req, res) => {
  try {
    const { likedPostIds } = req.body;
    const likedPosts = await Post.find({ _id: { $in: likedPostIds } }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "User's Liked Posts fetched successfully",
      likedPosts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching user's liked posts",
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

//Get all posts except the logged-in user's posts
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

const likeUnlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if user already liked the post
    const likedIndex = post.likes.indexOf(userId);

    if (likedIndex === -1) {
      // Like the post
      post.likes.push(userId);
      user.likedPosts.push(postId);
    } else {
      // Unlike the post
      post.likes.splice(likedIndex, 1);
      user.likedPosts = user.likedPosts.filter((id) => id.toString() !== postId);
    }

    await post.save();
    await user.save();

    res.status(200).json({
      likes: post.likes,
      likedPosts: user.likedPosts,  // Include user's liked posts
      success: true,
      message: "Successfully liked the post",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export { createPost, getPostsByIds, getLikedPostsByIds, getAllPosts, getAllPostsExceptMy, likeUnlikePost }