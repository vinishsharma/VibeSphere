import React, { useState, useEffect } from "react";
import { FaUserFriends, FaImages, FaMapMarkerAlt, FaBirthdayCake, FaInfoCircle, FaCamera, FaImage } from "react-icons/fa";
import axios from "axios";
import ProfilePostCard from '../components/ProfilePostCard'
import { changeDateFormat } from "../utils/helper";
import { useParams } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../context/AuthContext";

const UserProfile = () => {
  const { userId } = useParams(); // Get user ID from URL
  const [targetUser, setTargetUser] = useState(null);
  const { user, setUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/user/profile/${userId}`);
        const userData = response.data.user;

        setTargetUser(userData);
        setFollowersCount(userData.followers.length);
        setIsFollowing(userData.followers.includes(user._id));

      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [userId, user._id]);

  const handleFollowUnfollow = async () => {
    try {
      const response = await axios.put(
        `/api/user/follow/${targetUser._id}`,
        {},
        { withCredentials: true }
      );

      const updatedFollowers = response.data.tuFollowers;

      // Update global auth user state
      setUser((prevUser) => ({
        ...prevUser,
        following: response.data.myFollowing,
      }));

      // Update UI state optimistically
      setFollowersCount(updatedFollowers.length);
      setIsFollowing(updatedFollowers.includes(user._id));
    } catch (error) {
      console.error("Error following the user", error);
    }
  };

  if (!targetUser) return <Spinner />;

  return (
    <>
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto py-10 min-h-[90vh] px-4 bg-white rounded-3xl mt-12">
        {/* Profile Header */}
        <div>
          <div className="flex items-center w-full">
            <div className="w-1/3 flex items-center justify-center">
              <img
                src={targetUser?.profilePicture || "profile.jpg"}
                alt="Profile"
                className="w-52 h-52 rounded-full object-cover ring-1 ring-gray-200"
              />
            </div>
            <div className="w-2/3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-700">@{targetUser.username}</h2>
                <button
                  className={`px-4 py-1 rounded-lg border transition font-medium cursor-pointer ${isFollowing
                    ? "bg-blue-400 text-white border-blue-400 hover:bg-blue-500"
                    : "bg-white text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                    }`}
                  onClick={handleFollowUnfollow}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
              <div className="flex justify-center flex-row gap-20 mt-4 text-center">
                <div>
                  <FaImages className="text-xl mx-auto" />
                  <p className="font-bold">{targetUser.posts.length}</p>
                  <p className="text-gray-600">Posts</p>
                </div>
                <div>
                  <FaUserFriends className="text-xl mx-auto" />
                  <p className="font-bold">{followersCount}</p>
                  <p className="text-gray-600">Followers</p>
                </div>
                <div>
                  <FaUserFriends className="text-xl mx-auto" />
                  <p className="font-bold">{targetUser.following.length}</p>
                  <p className="text-gray-600">Following</p>
                </div>
              </div>
              <h2 className="text-2xl font-bold">{targetUser.name}</h2>
              <div className="flex items-center text-gray-600 gap-2">
                <FaMapMarkerAlt color="#999" />
                <p>{targetUser.city}</p>
              </div>
              <div className="flex items-center text-gray-600 gap-2">
                <FaInfoCircle color="#999" />
                <p>{targetUser.bio}</p>
              </div>
              <div className="flex items-center text-gray-600 gap-2">
                <FaBirthdayCake color="#999" />
                <p>{changeDateFormat(targetUser.dob)}</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-10 w-[60%] mx-auto border-1 border-gray-300" />

        <div className="flex justify-center mt-6 items-center gap-2 text-lg font-semibold text-gray-500">
          <FaImage /> POSTS
        </div>

        {/* Posts Section */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {targetUser.posts.length > 0 ? (
            targetUser.posts
              .slice() // Create a copy to avoid mutating original data
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt (newest first)
              .map((post) => <ProfilePostCard key={post._id} post={post} />)
          ) : (
            <div className="col-span-3 text-gray-500">
              <div className="flex flex-col items-center justify-center min-h-[30vh] text-gray-400">
                <div className='border-2 w-28 h-28 flex items-center justify-center border-gray-200 rounded-full mb-2'>
                  <FaCamera size={60} className=" text-gray-200" />
                </div>
                <p className="text-center text-lg font-semibold mb-4">
                  No Posts Yet
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default UserProfile


















// import React, { useState, useEffect } from "react";
// import { FaUserFriends, FaImages, FaMapMarkerAlt, FaBirthdayCake, FaInfoCircle, FaCamera } from "react-icons/fa";
// import axios from "axios";
// import ProfilePostCard from '../components/ProfilePostCard';
// import { changeDateFormat } from "../utils/helper";
// import { useParams } from "react-router-dom";
// import { Loader } from "../components/Spinner"; // Assuming you have a themed Loader
// import { useAuth } from "../context/AuthContext";
// import { motion } from "framer-motion";

// const UserProfile = () => {
//   const { userId } = useParams();
//   const [targetUser, setTargetUser] = useState(null);
//   const { user, setUser } = useAuth();
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [followersCount, setFollowersCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`/api/user/profile/${userId}`);
//         const userData = response.data.user;
//         setTargetUser(userData);
//         setFollowersCount(userData.followers.length);
//         if (user) { // Ensure logged-in user context is available
//           setIsFollowing(userData.followers.includes(user._id));
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [userId, user]);

//   const handleFollowUnfollow = async () => {
//     try {
//       const response = await axios.put(`/api/user/follow/${targetUser._id}`, {}, { withCredentials: true });
//       const updatedFollowers = response.data.tuFollowers;
//       setUser((prevUser) => ({ ...prevUser, following: response.data.myFollowing }));
//       setFollowersCount(updatedFollowers.length);
//       setIsFollowing(updatedFollowers.includes(user._id));
//     } catch (error) {
//       console.error("Error following the user", error);
//     }
//   };

//   const isMyProfile = user && user._id === userId;

//   // Animation variants for the post grid
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
//   };
//   const itemVariants = {
//     hidden: { y: 20, opacity: 0, scale: 0.95 },
//     visible: { y: 0, opacity: 1, scale: 1 }
//   };

//   if (loading) {
//     return (
//       <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient-x flex items-center justify-center">
//         <Loader />
//       </div>
//     );
//   }

//   return (
//     // THEME CHANGE: Full-page animated gradient background
//     <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient-x p-4 py-12">
//       <motion.div
//         className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto bg-white/60 backdrop-blur-lg p-6 rounded-3xl shadow-2xl shadow-purple-200/50"
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.7, type: "spring" }}
//       >
//         {/* --- Profile Header --- */}
//         <header className="flex flex-col md:flex-row items-center gap-8 p-4">
//           <div className="flex-shrink-0">
//             <img
//               src={targetUser?.profilePicture || "profile.jpg"}
//               alt="Profile"
//               className="w-40 h-40 rounded-full object-cover ring-4 ring-purple-300 ring-offset-4 ring-offset-white/50 shadow-lg"
//             />
//           </div>
//           <div className="flex flex-col items-center md:items-start w-full">
//             <div className="flex items-center gap-4 w-full justify-center md:justify-start mb-4">
//               <h2 className="text-3xl font-light text-slate-600">@{targetUser.username}</h2>
//               {!isMyProfile && (
//                 <motion.button
//                   onClick={handleFollowUnfollow}
//                   className={`px-5 py-2 rounded-full transition-all duration-300 font-semibold text-sm ${isFollowing ? "bg-transparent text-slate-500 border border-slate-400 hover:bg-slate-500 hover:text-white" : "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md shadow-purple-200/80"}`}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   {isFollowing ? "Unfollowing" : "Follow"}
//                 </motion.button>
//               )}
//             </div>
//             {/* Stats */}
//             <div className="flex gap-8 mb-4">
//               <div className="text-center"><p className="font-bold text-xl text-slate-800">{targetUser.posts.length}</p><p className="text-slate-500">Posts</p></div>
//               <div className="text-center"><p className="font-bold text-xl text-slate-800">{followersCount}</p><p className="text-slate-500">Followers</p></div>
//               <div className="text-center"><p className="font-bold text-xl text-slate-800">{targetUser.following.length}</p><p className="text-slate-500">Following</p></div>
//             </div>
//             {/* Bio */}
//             <div>
//               <h1 className="text-2xl font-bold text-slate-900">{targetUser.name}</h1>
//               <p className="flex items-center text-slate-600 gap-2 mt-1"><FaInfoCircle className="text-purple-500" />{targetUser.bio}</p>
//               <p className="flex items-center text-slate-600 gap-2"><FaMapMarkerAlt className="text-purple-500" />{targetUser.city}</p>
//               <p className="flex items-center text-slate-600 gap-2"><FaBirthdayCake className="text-purple-500" />Born on {changeDateFormat(targetUser.dob)}</p>
//             </div>
//           </div>
//         </header>

//         {/* --- Divider and Posts Section --- */}
//         <div className="mt-8 pt-6 border-t-2 border-purple-200/50">
//           <h3 className="text-center text-xl font-bold text-slate-700 tracking-widest mb-6">POSTS</h3>
//           <motion.div
//             className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//           >
//             {targetUser.posts.length > 0 ? (
//               targetUser.posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((post) => (
//                 <motion.div key={post._id} variants={itemVariants}>
//                   <ProfilePostCard post={post} />
//                 </motion.div>
//               ))
//             ) : (
//               <div className="col-span-full flex flex-col items-center justify-center min-h-[30vh] text-slate-500">
//                 <div className='p-8 border-4 border-dashed border-purple-200/80 rounded-full mb-4'>
//                   <FaCamera size={60} className="text-purple-300" />
//                 </div>
//                 <p className="text-center text-2xl font-bold text-slate-800">No Posts Yet</p>
//                 <p>This user hasn't shared any vibes.</p>
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// export default UserProfile;