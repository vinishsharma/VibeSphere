import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Loader } from './Spinner';
import { FiUsers } from 'react-icons/fi';
import UserBar from './UserBar';

const ProfileFollowersList = ({
  user,
  setDisplayFollowers
}) => {
  const [myFollowers, setMyFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  //Fetch user's folloewers when component mounts
  useEffect(() => {
    const fetchFollowers = async () => {
      if (!user?.followers || user.followers.length === 0) {
        setMyFollowers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post("/api/user/get-my-followers",
          { followersIds: user.followers },
          { withCredentials: true }
        );

        setMyFollowers(response.data.followers);
      } catch (err) {
        console.error("Error fetching followers:", err);
      } finally {
        setLoading(false); // Always stop loading after fetch
      }
    };

    fetchFollowers();
  }, [user.followers]); // Runs when user.posts change

  return (
    <>
      <div className="fixed inset-0 bg-[#22222277] flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-1/3">
          <h2 className="text-2xl font-bold mb-4 text-center text-[#163049]">My Followers</h2>

          <ul className="h-[50vh] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader loading={loading} />
              </div>
            ) : myFollowers.length > 0 ? (
              myFollowers.map(follower => (
                <UserBar key={follower._id} targetUser={follower} />
              ))
            ) : (
              <div className="text-center text-gray-500 h-full flex flex-col items-center justify-center">
                <FiUsers className="w-24 h-24 mx-auto mb-2 text-gray-400" />
                <h3 className="text-lg font-semibold">No Followers</h3>
                <p className="text-sm">
                  You have no followers yet.
                </p>
              </div>
            )}
          </ul>

          <button onClick={() => { setDisplayFollowers(false) }} className="w-full bg-gray-200 p-2 rounded-2xl mt-4 cursor-pointer"> Cancel </button>
        </div>
      </div>
    </>
  )
}

export default ProfileFollowersList