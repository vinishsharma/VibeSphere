import React, { useState, useEffect } from "react";
import { FaUserFriends, FaImages, FaHeart, FaMapMarkerAlt, FaBirthdayCake, FaInfoCircle, FaCamera, FaPlus } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import ProfileEditForm from "../components/ProfileEditForm";
import { toast } from "react-toastify";
import ProfilePostCard from "../components/ProfilePostCard";
import { Link } from "react-router-dom";
import { changeDateFormat } from "../utils/helper";
import ProfileFollowersList from "../components/ProfileFollowersList";
import ProfileFollowingsList from "../components/ProfileFollowingsList";

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState("myPosts");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profilePicURL, setProfilePicURL] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [displayFollowers, setDisplayFollowers] = useState(false);
  const [displayFollowings, setDisplayFollowings] = useState(false);

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

  //Uploading the image to Cloudinary
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

  //Saving the form to db
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
        setIsEditing(false);
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

  //Fetch user's all posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user?.posts?.length) return; // If no posts, exit early

      try {
        const response = await axios.post("/api/post/get-user-posts",
          { postIds: user.posts },
          { withCredentials: true }
        );
        setPosts(response.data.posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchUserPosts();
  }, [user.posts]); // Runs when user.posts change

  //Fetch user's liked posts
  useEffect(() => {
    const fetchUserLikedPosts = async () => {
      if (!user?.likedPosts?.length) return; // If no posts, exit early

      try {
        const response = await axios.post("/api/post/get-user-liked-posts",
          { likedPostIds: user.likedPosts },
          { withCredentials: true }
        );
        setLikedPosts(response.data.likedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchUserLikedPosts();
  }, [user.likedPosts]); // Runs when user.likedPosts change

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
                <p onClick={() => setDisplayFollowers(true)} className="text-gray-600 cursor-pointer">Followers</p>
              </div>
              <div>
                <FaUserFriends className="text-xl mx-auto" />
                <p className="font-bold">{user.following.length}</p>
                <p onClick={() => setDisplayFollowings(true)} className="text-gray-600 cursor-pointer">Following</p>
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
          className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "myPosts" ? "bg-blue-400 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("myPosts")}
        >
          <FaImages /> My Posts
        </button>
        <button
          className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "likedPosts" ? "bg-blue-400 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("likedPosts")}
        >
          <FaHeart /> Liked Posts
        </button>
      </div>

      {/* Posts Section */}
      <div className="grid grid-cols-3 gap-4 mt-12">
        {activeTab === "myPosts"
          ? posts.length > 0
            ? posts.map((post) => <ProfilePostCard key={post._id} post={post} />)
            : (
              <div className="col-span-3 text-gray-500">
                <div className="flex flex-col items-center justify-center min-h-[30vh] text-gray-400">
                  <div className='border-2 w-28 h-28 flex items-center justify-center border-gray-200 rounded-full mb-2'>
                    <FaCamera size={60} className=" text-gray-200" />
                  </div>
                  <p className="text-center text-lg font-semibold mb-4">
                    No Posts Yet
                  </p>
                  <div className="text-center text-md font-semibold flex items-center gap-2">
                    <div className="border-gray-400 border-2 rounded-md w-5 h-5 flex items-center justify-center">
                      <FaPlus size={12} />
                    </div>
                    Create your first post...<Link to='/create-post' className="text-blue-600">Create</Link>
                  </div>
                </div>
              </div>
            )
          : likedPosts.length > 0
            ? likedPosts.map((post) => <ProfilePostCard key={post._id} post={post} />)
            : (
              <div className="col-span-3 text-gray-500">
                <div className="flex flex-col items-center justify-center min-h-[30vh] text-gray-400">
                  <div className='border-2 w-28 h-28 flex items-center justify-center border-gray-200 rounded-full mb-2'>
                    <FaHeart size={60} className=" text-gray-200" />
                  </div>
                  <p className="text-center text-lg font-semibold mb-4">
                    No Liked Posts Yet
                  </p>
                </div>
              </div>
            )
        }
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

      {/* Floating Followers List */}
      {displayFollowers && (
        <ProfileFollowersList
          user={user}
          setDisplayFollowers={setDisplayFollowers}
        />
      )}

      {/* Floating Followings List */}
      {displayFollowings && (
        <ProfileFollowingsList
          user={user}
          setDisplayFollowings={setDisplayFollowings}
        />
      )}
    </div>
  );
};

export default MyProfile;

