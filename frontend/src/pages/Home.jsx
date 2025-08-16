import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import HomePostCard from "../components/HomePostCard.jsx";
import { Loader } from "../components/Spinner.jsx";
import { FaImage } from "react-icons/fa";

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

  return (
    <div className="w-full flex justify-center min-h-[90vh] py-10 ">
      {/* Fixed-width container */}
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%]">
        <div className="flex overflow-x-auto gap-5 scroll-smooth no-scrollbar snap-x snap-mandatory">
          {loading ? (
            <div className="flex justify-center items-center w-full h-full">
              <Loader loading={loading} />
            </div>
          ) : followingsPosts.length > 0 ? (
            followingsPosts.map((post) => (
              <div
                key={post._id}
                className="flex-none w-[100vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] snap-center snap-always hover:scale-100 transition-transform duration-200 ease-in-out scale-95"
              >
                <HomePostCard post={post} />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 w-full pt-50 flex flex-col items-center justify-center">
              <FaImage className="w-20 h-20 mb-3 text-gray-400" />
              <h3 className="text-lg font-semibold">No Posts Available</h3>
              <p>Follow users to see their posts on your feed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

