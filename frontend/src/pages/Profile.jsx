import React, { useState } from "react";
import { FaUserFriends, FaImages, FaHeart, FaMapMarkerAlt, FaCalendarDay, FaInfoCircle } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("myPosts");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    username: user?.username || "",
    name: user?.name || "",
    bio: user?.bio || "",
    city: user?.city || "",
    dob: user?.dob || "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.put(
        "/api/user/edit",
        formData,
        { withCredentials: true } // Ensures cookies are sent
      );

      setMessage(response.data.message || "Profile Updated Successful!");
      console.log("Updated Profile:", response.data);

      //Update auth context (without reloading)
      if (response.data.user) {
        setUser(response.data.user);
      }

      // setIsEditing(false);

    } catch (err) {
      setError(err.response?.data?.message || "Profile Updation Failed");
      console.error("Error in updating profile:", err);
    }
  };

  //Format the date before displaying
  const formatDate = (isoDate) => {
    if (!isoDate) return "Invalid Date";

    const date = new Date(isoDate);
    const options = { day: "numeric", month: "short", year: "numeric" };

    return date.toLocaleDateString("en-GB", options); // Example: "1 Jan 2000"
  };



  return (
    <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto py-10">
      {/* Profile Header */}
      <div>
        <div className="flex items-center w-full">
          <div className="w-1/3 flex items-center justify-center">
            <img
              src="profile.jpeg"
              alt="Profile"
              className="w-52 h-52 rounded-full object-cover ring-1 ring-gray-200"
            />
          </div>
          <div className="w-2/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-700">@{user.username}</h2>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-400 rounded-lg cursor-pointer hover:bg-blue-400 hover:text-white"
                onClick={() => setIsEditing(true)}
              >
                <FiEdit /> Edit Profile
              </button>
            </div>
            <div className="flex justify-center flex-row gap-20 mt-4 text-center">
              <div>
                <FaImages className="text-xl mx-auto" />
                <p className="font-bold">{user.posts.length}</p>
                <p className="text-gray-600">Posts</p>
              </div>
              <div>
                <FaUserFriends className="text-xl mx-auto" />
                <p className="font-bold">{user.followers.length}</p>
                <p className="text-gray-600">Followers</p>
              </div>
              <div>
                <FaUserFriends className="text-xl mx-auto" />
                <p className="font-bold">{user.following.length}</p>
                <p className="text-gray-600">Following</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <div className="flex items-center text-gray-600 gap-2">
              <FaMapMarkerAlt color="#999" />
              <p>{user.city}</p>
            </div>
            <div className="flex items-center text-gray-600 gap-2">
              <FaInfoCircle color="#999" />
              <p>{user.bio}</p>
            </div>
            <div className="flex items-center text-gray-600 gap-2">
              <FaCalendarDay color="#999" />
              <p>{formatDate(user.dob)}</p>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-10 w-[70%] mx-auto border-1 border-gray-500 border-dashed" />

      {/* Toggle Buttons for Posts */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "myPosts" ? "bg-blue-400 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("myPosts")}
        >
          <FaImages /> My Posts
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "likedPosts" ? "bg-blue-400 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("likedPosts")}
        >
          <FaHeart /> Liked Posts
        </button>
      </div>

      {/* Posts Section */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="bg-gray-200 h-40 rounded-lg shadow">
            <img
              src='temp.jpg'
              alt=''
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Floating Edit Profile Form */}
      {isEditing && (
        <div className="fixed inset-0 bg-[#2222225e] flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <label name="username">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full border p-2 rounded mb-2"
                placeholder="Username"
              />
              <label name="name">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border p-2 rounded mb-2"
                placeholder="Name"
              />
              <label name="city">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border p-2 rounded mb-2"
                placeholder="City"
              />
              <label name="bio">About Me</label>
              <input
                type="text"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full border p-2 rounded mb-2"
                placeholder="Bio"
              />
              <label name="dob">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full border p-2 rounded mb-4"
              />

              {/* Display Success or Failure of edit profile */}
              {message && <p className="text-green-500 text-center mb-4">{message}</p>}
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}

              <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:opacity-100 opacity-80">Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer hover:opacity-100 opacity-80">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

