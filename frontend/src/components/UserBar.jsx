// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// const UserBar = ({ targetUser }) => {
//   const navigate = useNavigate();
//   const { user, setUser } = useAuth();
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [localFollowers, setLocalFollowers] = useState(targetUser.followers);

//   // Sync local follow state when user or targetUser changes
//   useEffect(() => {
//     if (user && localFollowers.includes(user._id)) {
//       setIsFollowing(true);
//     } else {
//       setIsFollowing(false);
//     }
//   }, [user, localFollowers]);

//   const handleViewProfile = () => {
//     navigate(`/profile/${targetUser._id}`);
//   };

//   const handleFollowUnfollow = async () => {
//     try {
//       const res = await axios.put(
//         `/api/user/follow/${targetUser._id}`,
//         {},
//         { withCredentials: true }
//       );

//       // Update the logged-in user's "following"
//       setUser((prevUser) => ({
//         ...prevUser,
//         following: res.data.myFollowing,
//       }));

//       // Update local followers array to trigger re-render
//       setLocalFollowers(res.data.tuFollowers);
//     } catch (error) {
//       console.error("Error following/unfollowing user", error);
//     }
//   };

//   return (
//     <div className="flex items-center justify-between p-3 px-5 rounded-lg shadow-md bg-gray ring-1 ring-gray-100 mb-4 bg-white">
//       {/* Profile Image & Info */}
//       <div className="flex items-center">
//         <img
//           src={targetUser.profilePicture || "profile.jpg"}
//           alt={targetUser.name}
//           className="w-10 h-10 rounded-full object-cover"
//         />
//         <div className="ml-3 flex flex-col">
//           <span className="font-semibold text-gray-800 text-lg">{targetUser.name}</span>
//           <span className="text-sm text-gray-500">@{targetUser.username}</span>
//         </div>
//       </div>

//       {/* Follow / View Buttons */}
//       <div className="flex gap-4">
//         <button
//           onClick={handleFollowUnfollow}
//           className={`px-4 py-1 rounded-lg border transition font-medium cursor-pointer ${isFollowing
//             ? "bg-blue-400 text-white border-blue-400 hover:bg-blue-500"
//             : "bg-white text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
//             }`}
//         >
//           {isFollowing ? "Unfollow" : "Follow"}
//         </button>
//         <button
//           onClick={handleViewProfile}
//           className="px-4 py-1 bg-white border text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white rounded-lg cursor-pointer"
//         >
//           View
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserBar;






import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const UserBar = ({ targetUser }) => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [localFollowers, setLocalFollowers] = useState(targetUser.followers);

  // Sync local follow state when user or targetUser changes
  useEffect(() => {
    if (user && localFollowers.includes(user._id)) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [user, localFollowers]);

  const handleViewProfile = () => {
    navigate(`/profile/${targetUser._id}`);
  };

  const handleFollowUnfollow = async () => {
    try {
      const res = await axios.put(
        `/api/user/follow/${targetUser._id}`,
        {},
        { withCredentials: true }
      );

      // Update the logged-in user's "following"
      setUser((prevUser) => ({
        ...prevUser,
        following: res.data.myFollowing,
      }));

      // Update local followers array to trigger re-render
      setLocalFollowers(res.data.tuFollowers);
    } catch (error) {
      console.error("Error following/unfollowing user", error);
    }
  };

  return (
    // THEME CHANGE: Lighter, semi-transparent bar with a subtle hover effect
    <div className="flex items-center justify-between p-3 px-4 rounded-2xl bg-white/50 hover:bg-white/80 border border-white transition-all duration-300">
      {/* Profile Image & Info */}
      <div className="flex items-center">
        <img
          src={targetUser.profilePicture || "profile.jpg"}
          alt={targetUser.name}
          // THEME CHANGE: Themed ring around profile picture
          className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-300 ring-offset-2 ring-offset-white/30"
        />
        <div className="ml-4 flex flex-col">
          {/* THEME CHANGE: Themed typography */}
          <span className="font-bold text-slate-800 text-lg">{targetUser.name}</span>
          <span className="text-sm text-slate-500">@{targetUser.username}</span>
        </div>
      </div>

      {/* Follow / View Buttons */}
      <div className="flex gap-3">
        <motion.button
          onClick={handleFollowUnfollow}
          className={`cursor-pointer px-5 py-2 rounded-full transition-all duration-300 font-semibold text-sm ${isFollowing
            ? "bg-transparent text-slate-500 border border-slate-400 hover:bg-slate-500 hover:text-white"
            : "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md shadow-purple-200/80"
            }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isFollowing ? "Unfollowing" : "Follow"}
        </motion.button>
        <motion.button
          onClick={handleViewProfile}
          // THEME CHANGE: Secondary "ghost" button style
          className="px-5 py-2 bg-transparent border border-purple-400 text-purple-600 rounded-full font-semibold text-sm hover:bg-purple-500 hover:text-white transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View
        </motion.button>
      </div>
    </div>
  );
};

export default UserBar;