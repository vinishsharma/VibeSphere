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
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto py-10 min-h-[90vh] bg-white px-2">
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