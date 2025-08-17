// import React, { useState, useEffect } from "react";
// import { FaCalendarDay, FaComment } from "react-icons/fa";
// import { FcLikePlaceholder, FcLike } from "react-icons/fc";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// const ProfilePostCard = ({ post }) => {
//   const [likes, setLikes] = useState(post.likes);
//   const { user, setUser } = useAuth();

//   const handleLikeUnlike = async () => {
//     try {
//       const response = await axios.put(`/api/post/like/${post._id}`,
//         {},
//         { withCredentials: true }
//       );

//       // Update AuthContext/user-data with the new likedPosts array without reloading
//       setUser((prevUser) => ({
//         ...prevUser,
//         likedPosts: response.data.likedPosts,
//       }));

//       setLikes(response.data.likes);
//     } catch (error) {
//       console.error("Error liking the post", error);
//     }
//   };

//   return (
//     <div className="bg-white shadow-md rounded-2xl overflow-hidden border-1 border-gray-200 transition-transform transform hover:scale-105">
//       {/* Media (Image or Video) */}
//       <div className="w-full h-72 border-b-1 border-gray-300">
//         {post.media.type === "image" ? (
//           <img
//             src={post.media.url}
//             alt="Post"
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <video autoPlay muted loop className="object-cover h-full">
//             <source src={post.media.url} type="video/mp4" />
//           </video>
//         )}
//       </div>

//       {/* Post Details */}
//       <div className="px-3">
//         {/* Caption */}
//         <div className="py-2 font-bold truncate">{post.caption}</div>
//         {/* Likes & Comments Count */}
//         <div className="flex justify-between">
//           <Link to='/'>
//             <div className="flex items-center gap-2 text-blue-500 text-md">
//               <FaComment className="text-blue-400" /> {post.comments.length} Comments
//             </div>
//           </Link>
//           <div className="flex items-center gap-1 text-[#f44336] text-md">
//             <button onClick={handleLikeUnlike} className="cursor-pointer text-xl">
//               {likes.includes(user._id) ? <FcLike /> : <FcLikePlaceholder className="text-gray-200" />}
//             </button>
//             {likes.length} Likes
//           </div>
//         </div>

//         {/* Creation Date */}
//         <p className="text-gray-400 text-sm mt-2 flex justify-end items-center gap-1 pb-1">
//           <FaCalendarDay size={12} /> {new Date(post.createdAt).toLocaleDateString()}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ProfilePostCard;










import React, { useState } from "react";
import { FaComment } from "react-icons/fa";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const ProfilePostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const { user, setUser } = useAuth();

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
    <div className="group relative w-full aspect-square bg-slate-200 rounded-2xl overflow-hidden cursor-pointer">
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