import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import HomePostCard from "../components/HomePostCard.jsx";

const Home = () => {
  const [followingsPosts, setFollowingsPosts] = useState([]);

  // Fetch posts from followings
  useEffect(() => {
    const fetchFollowingsPosts = async () => {
      try {
        const response = await axios.get("/api/post/get-followings-posts", {
          withCredentials: true,
        });
        setFollowingsPosts(response.data.posts || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchFollowingsPosts();
  }, []);

  return (
    <div className="w-full flex justify-center min-h-[90vh] py-10">
      {/* Fixed-width container */}
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%]">
        <div className="flex overflow-x-auto gap-5 scroll-smooth no-scrollbar snap-x snap-mandatory">
          {followingsPosts.length > 0 ? (
            followingsPosts.map((post) => (
              <div
                key={post._id}
                className="flex-none w-[30vw] snap-center snap-always hover:scale-100 transition-transform duration-200 ease-in-out scale-95"
              >
                <HomePostCard post={post} />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 w-full">
              No posts available. Follow users to see their posts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

