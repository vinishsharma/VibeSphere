import React, { useState } from "react";
import { FaCalendarDay, FaComment, FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";


const HomePostCard = ({ post }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(post.likes);
  const { user, setUser } = useAuth();

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

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border-1 border-gray-200 w-full z-0">

      {/* User Info */}
      <div onClick={handleViewProfile} className="flex items-center p-3 border-b-1 border-gray-300 cursor-pointer">
        <img
          src={post.user.profilePicture}
          alt={post.user.name}
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{post.user.name}</h3>
          <p className="text-gray-500">@{post.user.username}</p>
        </div>
      </div>

      {/* Media (Image or Video) */}
      <div className="w-full h-[60vh] border-b-1 border-gray-300">
        {post.media.type === "image" ? (
          <img
            src={post.media.url}
            alt="Post"
            className="w-full h-full object-cover"
          />
        ) : (
          <video muted loop className="object-cover h-full">
            <source src={post.media.url} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Post Details */}
      <div className="px-3">
        {/* Caption */}
        <div className="py-2 font-bold truncate">{post.caption}</div>
        {/* Likes & Comments Count */}
        <div className="flex justify-between">

          <div className="flex items-center gap-1 text-[#f44336] text-md">
            <button onClick={handleLikeUnlike} className="cursor-pointer text-xl">
              {likes.includes(user._id) ? <FcLike /> : <FcLikePlaceholder className="text-gray-200" />}
            </button>
            {likes.length} Likes
          </div>

          <div className="flex items-center gap-2 text-gray-500 text-lg font-semibold">
            <FaComment className="text-gray-400" /> {post.comments.length} Comments
          </div>
        </div>

        {/* Creation Date */}
        <p className="text-gray-400 text-sm mt-2 flex justify-end items-center gap-1 pb-1">
          <FaCalendarDay size={12} /> {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default HomePostCard;