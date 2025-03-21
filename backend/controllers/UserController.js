import User from "../models/user.model.js";
import Post from '../models/post.model.js';


// Edit Profile Controller
const editProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, username, bio, dob, city, profilePicture } = req.body;

    // Check if the new username is already taken by another user
    const usernameExists = await User.findOne({ username, _id: { $ne: userId } });
    if (usernameExists) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, name, bio, city, dob, profilePicture },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};

//Controller to delete a user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated and ID is in req.user

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete all posts created by the user
    await Post.deleteMany({ user: userId });

    // Remove user from followers' following lists
    await User.updateMany({ following: userId }, { $pull: { following: userId } });

    // Remove user from following users' followers lists
    await User.updateMany({ followers: userId }, { $pull: { followers: userId } });

    // Remove the user's likes from all posts
    await Post.updateMany({ likes: userId }, { $pull: { likes: userId } });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User Account deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user"
    });
  }
};

//Get all users controller
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      message: "Successfuly fetched all users",
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all users",
      error: error.message,
    });
  }
};

//Controller to fetch all users except logged-in
const getAllUsersExceptMe = async (req, res) => {
  try {
    const myId = req.user.id;

    // Fetch all users except the logged-in user
    const users = await User.find({ _id: { $ne: myId } }).select("-password");

    res.status(200).json({
      success: true,
      message: "Successfully fetched all users except me",
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all users except me",
      error: error.message,
    });
  }
};


export { editProfile, getAllUsers, getAllUsersExceptMe };