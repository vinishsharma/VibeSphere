import React, { useState, useEffect } from "react";
import { FaUserFriends, FaImages, FaHeart, FaMapMarkerAlt, FaBirthdayCake, FaInfoCircle, FaCamera, FaPlus } from "react-icons/fa";
import { FiEdit, FiUsers } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import ProfileEditForm from "../components/ProfileEditForm";
import { toast } from "react-toastify";
import ProfilePostCard from "../components/ProfilePostCard";
import { Link } from "react-router-dom";
import { changeDateFormat } from "../utils/helper";
import ProfileFollowersList from "../components/ProfileFollowersList";
import ProfileFollowingsList from "../components/ProfileFollowingsList";
import { motion } from "framer-motion";

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
  const [originalFormData, setOriginalFormData] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    bio: "",
    city: "",
    profilePicture: "",
    dob: "",
  });

  // Effect to sync formData with the user context from useAuth
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        name: user.name || "",
        bio: user.bio || "",
        city: user.city || "",
        profilePicture: user.profilePicture || "",
        dob: user.dob || "",
      });
    }
  }, [user]);

  // Handler to open the edit modal and save the original state
  const handleOpenEditModal = () => {
    setOriginalFormData(formData); // Save the current state before editing
    setProfilePicURL(formData.profilePicture); // Set the initial preview image
    setIsEditing(true);
  };


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
      const response = await axios.post("/api/upload/profile-pic", fileData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (response.data.imageURL) {
        setFormData({ ...formData, profilePicture: response.data.imageURL });
        setProfilePicURL(response.data.imageURL);
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

      if (originalFormData.profilePicture && originalFormData.profilePicture !== response.data.user.profilePicture) {
        axios.post("/api/upload/delete-image", { imageURL: originalFormData.profilePicture }, { withCredentials: true });
      }
      setUser(response.data.user);
      toast.success(response.data.message || "Profile Updated Successfully!");
      setIsEditing(false);
      setOriginalFormData(null);

    } catch (err) {
      setError(err.response?.data?.message || "Profile Updation Failed");
      console.error("Error in updating profile:", err);
      toast.error(err.response?.data?.message || "Profile Updation Failed");
    }
  };

  // Handle cancel to delete the uploaded image if not save
  const handleCancel = async () => {
    if (formData.profilePicture && formData.profilePicture !== originalFormData.profilePicture) {
      try {
        await axios.post("/api/upload/delete-image", { imageURL: formData.profilePicture }, { withCredentials: true });
      } catch (err) {
        console.error("Failed to delete unused uploaded image:", err);
      }
    }
    setFormData(originalFormData);
    setIsEditing(false);
    setOriginalFormData(null);
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
  }, [user?.posts]); // Runs when user.posts change

  //Fetch user's liked posts
  useEffect(() => {
    const fetchUserLikedPosts = async () => {
      if (!user?.likedPosts?.length) {
        setLikedPosts([]);
        return;
      } // If no posts, exit early

      try {
        const response = await axios.post("/api/post/get-user-liked-posts",
          { likedPostIds: user.likedPosts },
          { withCredentials: true }
        );
        setLikedPosts(response.data.likedPosts);
      } catch (err) {
        console.error("Error fetching liked posts:", err);
      }
    };

    fetchUserLikedPosts();
  }, [user?.likedPosts]); // Runs when user.likedPosts change

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1 }
  };

  return (
    <div className="py-12">
      <motion.div
        className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto bg-white/60  p-6 rounded-4xl shadow-2xl shadow-purple-200/50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        {/* Profile Header */}
        <div>
          <div className="flex flex-col md:flex-row items-center w-full gap-8">
            <div className="w-full md:w-1/3 flex items-center justify-center">
              <img
                src={user?.profilePicture || "profile.jpg"}
                alt="Profile"
                className="w-52 h-52 rounded-full object-cover ring-4 ring-purple-300 ring-offset-4 ring-offset-white/50 shadow-lg"
              />
            </div>
            <div className="w-full md:w-2/3 flex flex-col gap-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-light text-slate-700">@{user.username}</h2>
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-transparent border border-purple-400 text-purple-600 rounded-full font-semibold text-sm hover:bg-purple-500 hover:text-white transition-all duration-300 cursor-pointer"
                  onClick={handleOpenEditModal}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >
                  <FiEdit /> Edit Profile
                </motion.button>
              </div>
              <div className="flex justify-center flex-row gap-20 mt-4 text-center">
                <div>
                  <FaImages className="text-xl mx-auto" />
                  <p className="font-bold">{user.posts.length}</p>
                  <p className="text-gray-600">Posts</p>
                </div>
                <div>
                  <FiUsers className="text-xl mx-auto" />
                  <p className="font-bold">{user.followers.length}</p>
                  <p onClick={() => setDisplayFollowers(true)} className="text-gray-600 cursor-pointer hover:text-purple-500 ">Followers</p>
                </div>
                <div>
                  <FaUserFriends className="text-xl mx-auto" />
                  <p className="font-bold">{user.following.length}</p>
                  <p onClick={() => setDisplayFollowings(true)} className="text-gray-600 cursor-pointer hover:text-purple-500">Following</p>
                </div>
              </div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <div>
                <div className="flex items-center text-gray-600 gap-2">
                  <FaMapMarkerAlt className="text-purple-500" />
                  <p>{user.city}</p>
                </div>
                <div className="flex items-center text-gray-600 gap-2">
                  <FaInfoCircle className="text-purple-500" />
                  <p>{user.bio}</p>
                </div>
                <div className="flex items-center text-gray-600 gap-2">
                  <FaBirthdayCake className="text-purple-500" />
                  <p>{changeDateFormat(user.dob)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="mt-8 w-full mx-auto border-1 border-purple-200/50" />

        {/* Toggle Buttons for Posts */}
        <div className="flex justify-center mt-6 bg-purple-100/50 p-1 rounded-full">
          <button
            className={`cursor-pointer w-1/2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${activeTab === 'myPosts' ? 'bg-white text-purple-600 shadow' : 'text-slate-600'}`}
            onClick={() => setActiveTab("myPosts")}
          >
            My Posts
          </button>
          <button
            className={`cursor-pointer w-1/2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${activeTab === 'likedPosts' ? 'bg-white text-purple-600 shadow' : 'text-slate-600'}`}
            onClick={() => setActiveTab("likedPosts")}
          >
            Liked Posts
          </button>
        </div>

        {/* Posts Section */}
        <motion.div
          className="grid grid-cols-3 gap-4 mt-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {activeTab === "myPosts"
            ? posts.length > 0
              ? posts.map((post) => <motion.div key={post._id} variants={itemVariants}><ProfilePostCard post={post} /></motion.div >)
              : (
                <div className="col-span-full text-slate-500 py-8">
                  <div className="flex flex-col items-center justify-center min-h-[30vh]">
                    <div className='p-8 border-4 border-dashed border-purple-200/80 rounded-full mb-4'>
                      <FaCamera size={60} className="text-purple-300" />
                    </div>
                    <p className="text-center text-2xl font-bold text-slate-800 mb-4">
                      No Posts Yet
                    </p>
                    <div className="text-center text-md font-semibold flex items-center gap-2 text-slate-500">
                      <div className="border-purple-300 bg-purple-100 text-purple-500 border-2 rounded-md w-6 h-6 flex items-center justify-center">
                        <FaPlus size={12} />
                      </div>
                      Ready to share?
                      <Link to='/create-post' className="text-purple-600 hover:underline">
                        Create your first vibe
                      </Link>
                    </div>
                  </div>
                </div>
              )
            : likedPosts.length > 0
              ? likedPosts.map((post) => <motion.div key={post._id} variants={itemVariants}><ProfilePostCard post={post} /></motion.div>)
              : (
                <div className="col-span-full text-slate-500 py-8">
                  <div className="flex flex-col items-center justify-center min-h-[30vh]">
                    <div className='p-8 border-4 border-dashed border-purple-200/80 rounded-full mb-4'>
                      <FaHeart size={60} className="text-purple-300" />
                    </div>
                    <p className="text-center text-2xl font-bold text-slate-800">
                      No Liked Posts Yet
                    </p>
                    <p className="text-slate-500 mt-2">
                      Posts you like will appear here.
                    </p>
                  </div>
                </div>
              )
          }
        </motion.div>

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

      </motion.div>
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



