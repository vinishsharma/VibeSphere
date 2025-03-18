import User from "../models/user.model.js";


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

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Get all users controller
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
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
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};


export { editProfile, getAllUsers, getAllUsersExceptMe };