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

export { createPost }