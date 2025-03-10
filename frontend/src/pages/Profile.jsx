import React from "react";
import { FaUserFriends, FaImages, FaHeart } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useState } from "react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("myPosts");
  return (
    <div className="w-[70%] mx-auto py-10">
      {/* Profile Header */}
      <div className="">

        {/* Profile Info */}
        <div className="flex items-center  w-full">
          <div className="w-1/3 flex items-center justify-center">
            <img
              src="profile.jpeg"
              alt="Profile"
              className="w-52 h-52 rounded-full object-cover ring-1 ring-gray-200"
            />
          </div>

          <div className="w-2/3">
            {/* Top Section with Username and Edit Profile */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">@johndoe</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
                <FiEdit /> Edit Profile
              </button>
            </div>


            {/* Stats Section */}
            <div className="flex justify-center flex-row gap-20 mt-4 text-center">
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

            <h2 className="text-2xl font-bold">John Doe</h2>
            <p className="text-gray-600">New York, USA</p>
            <p className="text-gray-600">Web Developer | Travel Enthusiast</p>
            <p className="text-gray-600">January 1, 1995</p>

          </div>
        </div>

      </div>

      <hr className="my-10 w-[70%] mx-auto border-1 border-gray-500 border-dashed" />

      {/* Posts Section */}
      {/* <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-gray-200 h-60 rounded-lg shadow">
            <img
              src={`temp.jpg`}
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div> */}

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
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="bg-gray-200 h-40 rounded-lg shadow">
            <img
              src={`https://via.placeholder.com/200?text=${activeTab === "myPosts" ? "Post" : "Liked"} +${index + 1}`}
              alt={`Post ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

    </div>
  );
};

export default Profile;
