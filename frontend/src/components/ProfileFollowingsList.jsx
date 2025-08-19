import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Loader } from './Spinner';
import { FaUserFriends } from 'react-icons/fa';
import UserBar from './UserBar';

const ProfileFollowingsList = ({
  user,
  setDisplayFollowings
}) => {
  const [myFollowings, setMyFollowings] = useState([]);
  const [loading, setLoading] = useState(true);
  //Fetch user's folloewers when component mounts
  useEffect(() => {
    const fetchFollowings = async () => {
      if (!user?.following || user.following.length === 0) {
        setMyFollowings([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post("/api/user/get-my-followings",
          { followingsIds: user.following },
          { withCredentials: true }
        );

        setMyFollowings(response.data.followings);
      } catch (err) {
        console.error("Error fetching followers:", err);
      } finally {
        setLoading(false); // Always stop loading after fetch
      }
    };

    fetchFollowings();
  }, [user.followings]); // Runs when user.posts change

  return (
    <>
      <div className="fixed inset-0 bg-[#22222277] flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-1/2">
          <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">My Followings</h2>

          <ul className="h-[50vh] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader loading={loading} />
              </div>
            ) : myFollowings.length > 0 ? (
              myFollowings.map(following => (
                <UserBar key={following._id} targetUser={following} />
              ))
            ) : (
              <div className="text-center text-gray-500 py-6 h-full flex flex-col items-center justify-center">
                <FaUserFriends className="w-24 h-24 mx-auto mb-2 text-gray-400" />
                <h3 className="text-lg font-semibold">No Followings</h3>
                <p className="text-sm">
                  You are not following anyone. Start following people!
                </p>
              </div>
            )}
          </ul>

          <button onClick={() => { setDisplayFollowings(false) }} className="w-full bg-gray-200 p-2 rounded-2xl mt-4 cursor-pointer"> Cancel </button>
        </div>
      </div>
    </>
  )
}

export default ProfileFollowingsList