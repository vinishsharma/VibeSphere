// import React, { useState } from "react";
// import { FaCalendarDay, FaComment, FaHeart } from "react-icons/fa";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { FcLikePlaceholder, FcLike } from "react-icons/fc";


// const HomePostCard = ({ post }) => {
//   const navigate = useNavigate();
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

//   const handleViewProfile = () => {
//     navigate(`/profile/${post.user._id}`);
//   };

//   return (
//     <div className="bg-white shadow-md rounded-lg overflow-hidden border-1 border-gray-200 w-full z-0">

//       {/* User Info */}
//       <div onClick={handleViewProfile} className="flex items-center p-3 border-b-1 border-gray-300 cursor-pointer">
//         <img
//           src={post.user.profilePicture}
//           alt={post.user.name}
//           className="w-10 h-10 rounded-full mr-3 object-cover"
//         />
//         <div>
//           <h3 className="text-lg font-semibold">{post.user.name}</h3>
//           <p className="text-gray-500">@{post.user.username}</p>
//         </div>
//       </div>

//       {/* Media (Image or Video) */}
//       <div className="w-full h-[60vh] border-b-1 border-gray-300">
//         {post.media.type === "image" ? (
//           <img
//             src={post.media.url}
//             alt="Post"
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <video muted loop className="object-cover h-full">
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

//           <div className="flex items-center gap-1 text-[#f44336] text-md">
//             <button onClick={handleLikeUnlike} className="cursor-pointer text-xl">
//               {likes.includes(user._id) ? <FcLike /> : <FcLikePlaceholder className="text-gray-200" />}
//             </button>
//             {likes.length} Likes
//           </div>

//           <div className="flex items-center gap-2 text-gray-500 text-lg font-semibold">
//             <FaComment className="text-gray-400" /> {post.comments.length} Comments
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

// export default HomePostCard;











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
        className="w-full h-[55vh] bg-black/10"
        onMouseEnter={() => handleVideoHover(true)}
        onMouseLeave={() => handleVideoHover(false)}
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