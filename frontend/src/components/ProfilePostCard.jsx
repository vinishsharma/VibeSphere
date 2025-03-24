import React, { useState, useEffect } from "react";
import { FaCalendarDay, FaComment, FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ProfilePostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const { user, setUser } = useAuth();

  const handleLikeUnlike = async () => {
    try {
      const response = await axios.put(`/api/post/like/${post._id}`,
        {},
        { withCredentials: true }
      );

      // Update AuthContext/user-data with the new likedPosts array without reloading
      console.log(response.data.likedPosts);
      setUser((prevUser) => ({
        ...prevUser,
        likedPosts: response.data.likedPosts,
      }));

      setLikes(response.data.likes);
    } catch (error) {
      console.error("Error liking the post", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border-1 border-gray-200">
      {/* Media (Image or Video) */}
      <div className="w-full h-64 border-b-1 border-gray-300">
        {post.media.type === "image" ? (
          <img
            src={post.media.url}
            alt="Post"
            className="w-full h-full object-cover"
          />
        ) : (
          <video autoPlay muted loop className="object-cover h-full">
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
          <Link to='/'>
            <div className="flex items-center gap-2 text-blue-500 text-md">
              <FaComment className="text-blue-400" /> {post.comments.length} Comments
            </div>
          </Link>
          <div className="flex items-center gap-2 text-pink-500 text-md">
            <button onClick={handleLikeUnlike} className="cursor-pointer text-lg">
              {likes.includes(user._id) ? <FaHeart /> : <FaRegHeart className="text-gray-200" />}
            </button>
            {likes.length} Likes
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

export default ProfilePostCard;