# Posts and Liked Posts

```jsx
import React, { useState, useEffect } from "react";
import { FaUserFriends, FaImages, FaHeart } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("myPosts");
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts/${activeTab === "myPosts" ? "myposts" : "liked"}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [activeTab]); // Runs when activeTab changes

  return (
    <div className="w-[70%] mx-auto py-10">
      {/* Profile Header */}
      <div className="border-b pb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">@johndoe</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
            <FiEdit /> Edit Profile
          </button>
        </div>
        
        <div className="flex items-center gap-10">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-bold">John Doe</h2>
            <p className="text-gray-600">New York, USA</p>
            <p className="text-gray-600">Web Developer | Travel Enthusiast</p>
            <p className="text-gray-600">DOB: January 1, 1995</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex gap-8 mt-4 text-center">
          <div>
            <FaImages className="text-xl mx-auto" />
            <p className="font-bold">120</p>
            <p className="text-gray-600">Posts</p>
          </div>
          <div>
            <FaUserFriends className="text-xl mx-auto" />
            <p className="font-bold">2.5K</p>
            <p className="text-gray-600">Followers</p>
          </div>
          <div>
            <FaUserFriends className="text-xl mx-auto" />
            <p className="font-bold">1.8K</p>
            <p className="text-gray-600">Following</p>
          </div>
        </div>
      </div>

      {/* Toggle Buttons for Posts */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "myPosts" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("myPosts")}
        >
          <FaImages /> My Posts
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "likedPosts" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("likedPosts")}
        >
          <FaHeart /> Liked Posts
        </button>
      </div>

      {/* Posts Section */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="bg-gray-200 h-40 rounded-lg shadow">
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">No posts available</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
```

