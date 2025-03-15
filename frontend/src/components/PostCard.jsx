import React from "react";
import { FaCalendarDay, FaComment, FaHeart } from "react-icons/fa";

const PostCard = ({ post }) => {
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
          <video controls className="w-full h-full">
            <source src={post.media.url} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Post Details */}
      <div className="p-3">
        {/* Likes & Comments Count */}
        <div className="flex justify-between">
          <div className="flex items-center gap-2 text-gray-500 text-lg font-semibold">
            <FaHeart className="text-gray-400" /> {post.likes.length} Likes
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-lg font-semibold">
            <FaComment className="text-gray-400" /> {post.comments.length} Comments
          </div>
        </div>

        {/* Creation Date */}
        <p className="text-gray-400 text-sm mt-2 flex justify-end items-center gap-1">
          <FaCalendarDay size={12} /> {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PostCard;