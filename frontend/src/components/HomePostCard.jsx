import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCalendarDay, FaComment } from "react-icons/fa";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { motion } from "framer-motion";
import { changeDateFormat } from "../utils/helper.js";

const HomePostCard = ({ post }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(post.likes);
  const { user, setUser } = useAuth();
  const videoRef = useRef(null);

  const handleLikeUnlike = async () => {
    try {
      const response = await axios.put(`/api/post/like/${post._id}`,
        {},
        { withCredentials: true }
      );

      // Update AuthContext/user-data with the new likedPosts array without reloading
      setUser((prevUser) => ({
        ...prevUser,
        likedPosts: response.data.likedPosts,
      }));

      setLikes(response.data.likes);
    } catch (error) {
      console.error("Error liking the post", error);
    }
  };

  const handleViewProfile = () => {
    navigate(`/profile/${post.user._id}`);
  };

  // Modern UX for videos: play on hover
  const handleVideoHover = (isHovering) => {
    if (videoRef.current) {
      isHovering ? videoRef.current.play() : videoRef.current.pause();
    }
  };

  // Navigate to post detail page
  const handleViewPost = () => {
    navigate(`/post/${post._id}`);
  };

  // Check if the post is liked by the logged-in user 
  const isLiked = user && likes.includes(user._id);

  return (
    // THEME CHANGE: Frosted glass card with themed shadow and ring
    <div className="bg-white/60 backdrop-blur-xl shadow-2xl shadow-purple-200/50 rounded-2xl overflow-hidden ring-1 ring-white/50 w-full">
      {/* User Info */}
      <div
        onClick={handleViewProfile}
        className="flex items-center p-4 cursor-pointer hover:bg-white/40 transition-colors duration-300"
      >
        <img
          src={post.user.profilePicture}
          alt={post.user.name}
          // THEME CHANGE: Themed ring on profile picture
          className="w-12 h-12 rounded-full mr-4 object-cover ring-2 ring-purple-300 ring-offset-2 ring-offset-white/30"
        />
        <div>
          <h3 className="text-lg font-bold text-slate-800">{post.user.name}</h3>
          <p className="text-slate-500">@{post.user.username}</p>
        </div>
      </div>

      {/* Media (Image or Video) */}
      <div
        className="w-full h-[55vh] bg-black/10 cursor-pointer"
        onMouseEnter={() => handleVideoHover(true)}
        onMouseLeave={() => handleVideoHover(false)}
        onClick={handleViewPost}
      >
        {post.media.type === "image" ? (
          <img src={post.media.url} alt="Post" className="w-full h-full object-cover" />
        ) : (
          <video ref={videoRef} muted loop className="w-full h-full object-cover">
            <source src={post.media.url} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Post Details */}
      <div className="p-4">
        {/* Likes & Comments Count */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            {/* THEME CHANGE: Animated like button */}
            <motion.button
              onClick={handleLikeUnlike}
              className="cursor-pointer text-3xl"
              whileTap={{ scale: 1.4, transition: { type: "spring", stiffness: 400, damping: 10 } }}
            >
              {isLiked ? <FcLike /> : <FcLikePlaceholder />}
            </motion.button>
            <div className="flex items-center gap-2 text-slate-600 text-lg font-semibold">
              <FaComment className="text-slate-400" /> {post.comments.length}
            </div>
          </div>

          <p className="text-slate-400 text-sm flex items-center gap-2">

            <FaCalendarDay size={14} />{changeDateFormat(post.createdAt)}
          </p>
        </div>

        {/* THEME CHANGE: Themed like count and caption text */}
        <p className={`font-bold text-md ${isLiked ? 'text-purple-600' : 'text-slate-700'}`}>
          {likes.length} {likes.length === 1 ? 'like' : 'likes'}
        </p>
        <p className="text-slate-700 mt-1 truncate">
          <span className="font-bold text-slate-800 mr-2">@{post.user.username}</span>
          {post.caption}
        </p>
      </div>
    </div>
  );
};

export default HomePostCard;