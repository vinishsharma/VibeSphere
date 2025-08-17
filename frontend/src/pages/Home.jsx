// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import HomePostCard from "../components/HomePostCard.jsx";
// import { Loader } from "../components/Spinner.jsx";
// import { FaImage } from "react-icons/fa";

// const Home = () => {
//   const [followingsPosts, setFollowingsPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch posts from followings
//   useEffect(() => {
//     const fetchFollowingsPosts = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get("/api/post/get-followings-posts", {
//           withCredentials: true,
//         });
//         setFollowingsPosts(response.data.posts || []);
//       } catch (err) {
//         console.error("Error fetching posts:", err);
//       } finally {
//         setLoading(false); // Always stop loading after fetch
//       }
//     };
//     fetchFollowingsPosts();
//   }, []);

//   return (
//     // <div className="w-full flex justify-center py-10">
//     <div className="w-full mx-auto sm:w-full md:w-[80%] lg:w-[70%] bg-white py-12 min-h-[90vh] ">
//       {/* Fixed-width container */}
//       <div className="flex overflow-x-auto gap-5 scroll-smooth no-scrollbar snap-x snap-mandatory">
//         {loading ? (
//           <div className="flex justify-center items-center w-full h-full">
//             <Loader loading={loading} />
//           </div>
//         ) : followingsPosts.length > 0 ? (
//           followingsPosts.map((post) => (
//             <div
//               key={post._id}
//               className="flex-none w-[100vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] snap-center snap-always hover:scale-100 transition-transform duration-200 ease-in-out scale-95"
//             >
//               <HomePostCard post={post} />
//             </div>
//           ))
//         ) : (
//           <div className="text-center text-gray-500 w-full pt-50 flex flex-col items-center justify-center">
//             <FaImage className="w-20 h-20 mb-3 text-gray-400" />
//             <h3 className="text-lg font-semibold">No Posts Available</h3>
//             <p>Follow users to see their posts on your feed.</p>
//           </div>
//         )}
//       </div>
//     </div>
//     // </div>
//   );
// };

// export default Home;











import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import HomePostCard from "../components/HomePostCard.jsx";
import { motion } from "framer-motion";
import { FaUsers } from "react-icons/fa"; // A more fitting icon for the theme
import { SkeletonCard } from "../components/Spinner.jsx";

const Home = () => {
  const [followingsPosts, setFollowingsPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from followings
  useEffect(() => {
    const fetchFollowingsPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/post/get-followings-posts", {
          withCredentials: true,
        });
        setFollowingsPosts(response.data.posts || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false); // Always stop loading after fetch
      }
    };
    fetchFollowingsPosts();
  }, []);

  // --- Animation Variants for Staggered Entry ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Each child will animate 0.2s after the previous one
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    // THEME CHANGE: The background is now a soft, static aurora gradient
    <div className="w-full mx-auto sm:w-full md:w-[80%] lg:w-[70%] min-h-[90vh] flex items-center ">
      {loading ? (
        <div className="flex overflow-x-auto no-scrollbar px-4 ">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : followingsPosts.length > 0 ? (
        <motion.div
          className="flex overflow-x-auto gap-8 scroll-smooth no-scrollbar snap-x snap-mandatory p-4 md:px-8 "
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {followingsPosts.map((post) => (
            <motion.div
              key={post._id}
              className="flex-none w-[90vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] snap-center "
              variants={itemVariants} // Each item uses the same animation variant
              transition={{ duration: 0.2, ease: "easeOut" }}
              whileHover={{
                y: -10
              }}
            >
              {/* THEME CHANGE: Added a themed hover effect with a soft, colored shadow */}
              <div className="transition-all duration-300 ">
                <HomePostCard post={post} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // --- THEMED "NO POSTS" EMPTY STATE ---
        <motion.div
          className="text-center w-full max-w-md mx-auto flex flex-col items-center justify-center p-10 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg shadow-purple-100/50"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <div className="p-5 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mb-6">
            <FaUsers className="w-16 h-16 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Your Feed Awaits</h3>
          <p className="text-slate-500 mb-6">Follow creators on VibeSphere to see their uploaded posts here.</p>
          <Link to="/search-user">
            <motion.button
              className="text-white font-bold px-8 py-3 rounded-full shadow-lg bg-gradient-to-r from-pink-500 to-purple-500"
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(192, 132, 252, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Find People to Follow
            </motion.button>
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Home;