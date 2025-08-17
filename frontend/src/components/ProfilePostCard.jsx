import React, { useState } from "react";
import { FaComment } from "react-icons/fa";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProfilePostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLikeUnlike = async (e) => {
    // Stop click from bubbling up if there's a parent Link/navigation
    e.stopPropagation();
    try {
      const response = await axios.put(`/api/post/like/${post._id}`, {}, { withCredentials: true });
      setUser((prevUser) => ({ ...prevUser, likedPosts: response.data.likedPosts }));
      setLikes(response.data.likes);
    } catch (error) {
      console.error("Error liking the post", error);
    }
  };

  const isLiked = user && likes.includes(user._id);

  return (
    // THEME CHANGE: Main container is now a "group" to enable hover effects on children
    <div
      className="group relative w-full aspect-square bg-slate-200 rounded-2xl overflow-hidden cursor-pointer"
      onClick={() => navigate(`/post/${post._id}`)} // Navigate to post display
    >
      {/* Media (Image or Video) - The base layer */}
      {post.media.type === "image" ? (
        <img src={post.media.url} alt="Post" className="w-full h-full object-cover" />
      ) : (
        <video autoPlay muted loop className="w-full h-full object-cover">
          <source src={post.media.url} type="video/mp4" />
        </video>
      )}

      {/* THEME CHANGE: The interactive overlay that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex gap-6 text-white text-xl font-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          {/* Likes */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleLikeUnlike}
              className="cursor-pointer text-3xl"
              whileTap={{ scale: 1.4, transition: { type: "spring", stiffness: 400, damping: 10 } }}
            >
              {isLiked ? <FcLike /> : <FcLikePlaceholder />}
            </motion.button>
            <span>{likes.length}</span>
          </div>
          {/* Comments */}
          <div className="flex items-center gap-2">
            <FaComment />
            <span>{post.comments.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePostCard;