import React from "react";

const UserBar = ({ user }) => {
  return (
    <div className="flex items-center justify-between p-3 px-5 rounded-lg shadow-md bg-gray ring-1 ring-gray-100 mb-4">
      {/* Profile Image */}
      <div className="flex">
        <img
          src={user.profilePicture || "profile.jpg"} // Default image if none
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />

        {/* User Info */}
        <div className="ml-3 flex flex-col">
          <span className="font-semibold text-gray-800 text-lg">{user.name}</span>
          <span className="text-sm text-gray-500">@{user.username}</span>
        </div>
      </div>

      {/* Follow Button */}
      <div className="flex gap-4">
        <button className="px-4 py-1 bg-white border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-blue-600 hover:border-blue-600 cursor-pointer hover:text-white">
          Follow
        </button>
        <button className="px-4 py-1 bg-white border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-blue-600 hover:border-blue-600 cursor-pointer hover:text-white">
          View
        </button>

      </div>
    </div>
  );
};

export default UserBar;