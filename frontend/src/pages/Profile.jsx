import React, { useState, useEffect } from "react";
import { FaUserFriends, FaImages, FaHeart, FaMapMarkerAlt, FaBirthdayCake, FaInfoCircle } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import ProfileEditForm from "../components/ProfileEditForm";
import { toast } from "react-toastify";
import PostCard from "../components/PostCard"

const Profile = () => {
  const [activeTab, setActiveTab] = useState("myPosts");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profilePicURL, setProfilePicURL] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuth();
  const [posts, setPosts] = useState([]);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    name: user?.name || "",
    bio: user?.bio || "",
    city: user?.city || "",
    profilePicture: user?.profilePicture || "",
    dob: user?.dob || "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append("profile-pic", file);

    try {
      setLoading(true);

      // Save previous profile picture before uploading a new one
      const previousProfilePic = formData.profilePicture;

      const response = await axios.post("/api/upload/profile-pic", fileData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.imageURL) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          profilePicture: response.data.imageURL, // Set new image
        }));
        setProfilePicURL(response.data.imageURL);

        // Store previous image for potential deletion
        setFormData((prevFormData) => ({
          ...prevFormData,
          previousProfilePic,
        }));
      }
    } catch (err) {
      console.error("Error uploading profile pic:", err);
      setError("Failed to upload profile pic");
      toast.error("Failed Uploading Profile Pic");
    } finally {
      setLoading(false);
    }
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
      // console.log("Updated Profile:", response.data);

      //Update auth context (without reloading)
      if (response.data.user) {
        setUser(response.data.user);
      }

      toast.success(response.data.message || "Profile Updated Successful!");
      setIsEditing(false);

      // Clear previousProfilePic since it's no longer needed
      setFormData((prev) => ({ ...prev, previousProfilePic: "" }));

    } catch (err) {
      setError(err.response?.data?.message || "Profile Updation Failed");
      console.error("Error in updating profile:", err);
      toast.error(err.response?.data?.message || "Profile Updation Failed");
    }
  };

  // Handle cancel to delete the uploaded image if not save
  const handleCancel = async () => {
    if (profilePicURL && profilePicURL !== formData.previousProfilePic) {
      try {
        await axios.post("/api/upload/delete-image", { imageURL: profilePicURL }, { withCredentials: true });
        // console.log("Deleted image from Cloudinary:", profilePicURL);
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }

    // Reset state
    setIsEditing(false);
    setProfilePicURL(""); // Restore old image
    setFormData((prev) => ({ ...prev, profilePicture: prev.previousProfilePic || "" }));
  };

  //Format the date before displaying
  const changeDateFormat = (isoDate) => {
    if (!isoDate) return "Invalid Date";

    const date = new Date(isoDate);
    const options = { day: "numeric", month: "short", year: "numeric" };

    return date.toLocaleDateString("en-GB", options); // Example: "1 Jan 2000"
  };

  //Fetch user's all posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user?.posts?.length) return; // If no posts, exit early

      try {
        const res = await axios.post("/api/post/getPostsByIds", { postIds: user.posts });
        setPosts(res.data.posts); // Assuming API returns { posts: [...] }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchUserPosts();
  }, [user.posts]); // Runs when user.posts change

  return (
    <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto py-10">
      {/* Profile Header */}
      <div>
        <div className="flex items-center w-full">
          <div className="w-1/3 flex items-center justify-center">
            <img
              src={user?.profilePicture || "profile.jpg"}
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
              <FaBirthdayCake color="#999" />
              <p>{changeDateFormat(user.dob)}</p>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-10 w-[60%] mx-auto border-1 border-gray-300" />

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
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p className="text-center col-span-3 text-gray-500">No posts found.</p>
        )}
      </div>

      {/* Floating Edit Profile Form */}
      {isEditing && (
        <ProfileEditForm
          loading={loading}
          formData={formData}
          profilePicURL={profilePicURL}
          handleImageUpload={handleImageUpload}
          handleSubmit={handleSubmit}
          setIsEditing={setIsEditing}
          setProfilePicURL={setProfilePicURL}
          handleInputChange={handleInputChange}
          handleCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Profile;

