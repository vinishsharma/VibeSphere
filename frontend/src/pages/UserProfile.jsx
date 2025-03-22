import React, { useState, useEffect } from "react";
import { FaUserFriends, FaImages, FaMapMarkerAlt, FaBirthdayCake, FaInfoCircle, FaCamera } from "react-icons/fa";
import axios from "axios";
import UserPostCard from '../components/UserPostCard'
import { changeDateFormat } from "../utils/helper";
import { useParams } from "react-router-dom";
import { Spinner } from "../components/Spinner";

const UserProfile = () => {
  const { userId } = useParams(); // Get user ID from URL
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/user/profile/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [userId]);

  if (!user) return <Spinner />;

  return (
    <>
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto py-10">
        {/* Profile Header */}
        <div>
          <div className="flex items-center w-full">
            <div className="w-1/3 flex items-center justify-center">
              <img
                src={user?.profilePicture || "profile.jpg"}
                alt="Profile"
                className="w-52 h-52 rounded-full object-cover ring-1 ring-gray-200"
              />
            </div>
            <div className="w-2/3">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">@{user.username}</h2>
              <div className="flex justify-center flex-row gap-20 mt-4 text-center">
                <div>
                  <FaImages className="text-xl mx-auto" />
                  <p className="font-bold">{user.posts.length}</p>
                  <p className="text-gray-600">Posts</p>
                </div>
                <div>
                  <FaUserFriends className="text-xl mx-auto" />
                  <p className="font-bold">{user.followers.length}</p>
                  <p className="text-gray-600">Followers</p>
                </div>
                <div>
                  <FaUserFriends className="text-xl mx-auto" />
                  <p className="font-bold">{user.following.length}</p>
                  <p className="text-gray-600">Following</p>
                </div>
              </div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <div className="flex items-center text-gray-600 gap-2">
                <FaMapMarkerAlt color="#999" />
                <p>{user.city}</p>
              </div>
              <div className="flex items-center text-gray-600 gap-2">
                <FaInfoCircle color="#999" />
                <p>{user.bio}</p>
              </div>
              <div className="flex items-center text-gray-600 gap-2">
                <FaBirthdayCake color="#999" />
                <p>{changeDateFormat(user.dob)}</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-10 w-[60%] mx-auto border-1 border-gray-300" />

        {/* Posts Section */}
        <div className="grid grid-cols-3 gap-4 mt-12">
          {user.posts.length > 0 ? (
            user.posts
              .slice() // Create a copy to avoid mutating original data
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt (newest first)
              .map((post) => <UserPostCard key={post._id} post={post} />)
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