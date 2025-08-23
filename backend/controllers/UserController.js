import User from "../models/user.model.js";
import Post from '../models/post.model.js';
import bcrypt from 'bcrypt';
import Message from "../models/message.model.js";

// Edit Profile Controller
const editProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, username, bio, dob, city, profilePicture } = req.body;

    // Check if the new username is already taken by another user
    const usernameExists = await User.findOne({ username, _id: { $ne: userId } });
    if (usernameExists) {
      return res.status(409).json({ success: false, message: "Username already taken" });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, name, bio, city, dob, profilePicture },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
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
const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

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

    // Delete all messages sent or received by the user
    await Message.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User Account Deleted Successfully"
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user"
    });
  }
};


//toggle user privacy controller
const togglePrivacy = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user and toggle the isAccountPrivate field
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isAccountPrivate = !user.isAccountPrivate; // Toggle privacy setting
    await user.save();

    res.status(200).json({
      success: true,
      message: "Account privacy updated successfully",
      isAccountPrivate: user.isAccountPrivate
    });
  } catch (error) {
    console.error("Error toggling account privacy:", error);
    res.status(500).json({ success: false, message: "Failed to update account privacy" });
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


//controller to get user by id
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params; // Get user ID from request params

    // Find user by ID, populate posts, and exclude password
    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "posts",
        model: Post,
        select: "caption media likes comments createdAt", // Only select necessary fields
        // populate: {
        //   path: "user",
        //   select: "name username profilePicture", // Populate user details inside posts
        // },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User Data Fetched Successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

//controller to update password
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // Get user from auth middleware

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compare old password with stored hash
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect old password" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

//controller to follow unfollow user
const followUnfollowUser = async (req, res) => {
  try {
    const myId = req.user.id;       //logged-in user id from auth middleware
    const { userId } = req.params;  // target user to follow/unfollow

    if (myId === userId) {
      return res.status(400).json({ message: "You can't follow yourself." });
    }

    const me = await User.findById(myId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const isFollowing = me.following.includes(userId);

    if (isFollowing) {
      // Unfollow logic
      me.following.pull(userId);
      targetUser.followers.pull(myId);
      await me.save();
      await targetUser.save();

      return res.status(200).json({
        message: "User unfollowed successfully.",
        success: true,
        myFollowing: me.following,
        tuFollowers: targetUser.followers
      });
    }
    else {
      // Follow logic
      me.following.push(userId);
      targetUser.followers.push(myId);
      await me.save();
      await targetUser.save();

      return res.status(200).json({
        message: "User followed successfully.",
        success: true,
        myFollowing: me.following,
        tuFollowers: targetUser.followers
      });
    }
  } catch (error) {
    console.error("Follow/Unfollow Error:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
      success: false
    });
  }
}

//Get all followers of logged-in user
const getFollowersByIds = async (req, res) => {
  try {
    const { followersIds } = req.body;
    const followers = await User.find({ _id: { $in: followersIds } }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "User Followers fetched successfully",
      followers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching user's followers",
      success: false
    });
  }
}

//Get all followings of logged-in user
const getFollowingsByIds = async (req, res) => {
  try {
    const { followingsIds } = req.body;
    const followings = await User.find({ _id: { $in: followingsIds } }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "User Followings fetched successfully",
      followings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching user's followings",
      success: false
    });
  }
}



export { editProfile, getAllUsers, getAllUsersExceptMe, deleteUser, togglePrivacy, getUserById, updatePassword, followUnfollowUser, getFollowersByIds, getFollowingsByIds };