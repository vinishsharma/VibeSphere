import React, { useState } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Setting = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const { logout } = useAuth();

  const handleTogglePrivacy = () => {
    setIsPrivate(!isPrivate);
    // TODO: Send update request to backend
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible!"
    );
    if (confirmDelete) {
      const response = await axios.delete('/api/user/delete');
      // console.log(response);
      logout();
      toast.success("Account Deleted Successfully");
    }
  };

  return (
    <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto py-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>

      {/* Delete Account Button */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6 ring-1 ring-gray-100 shadow-md">
        <div>
          <h1 className="text-lg font-semibold">Delete Your Account</h1>
          <p className="text-sm text-gray-600">All your posts and data will be permanently deleted and cannot be recovered in the future.</p>
        </div>
        <button
          onClick={handleDeleteAccount}
          className="px-3 py-1 border-1 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition cursor-pointer"
        >
          Delete
        </button>
      </div>

      {/* Privacy Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6 ring-1 ring-gray-100 shadow-md">
        <div>
          <h1 className="text-lg font-semibold">Make Account Private</h1>
          <p className="text-sm text-gray-600">All your uploaded posts will be visible only to your followers.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isPrivate}
            onChange={handleTogglePrivacy}
          />
          <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors relative">
            <div
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all transform ${isPrivate ? "translate-x-6" : "translate-x-0"
                }`}
            ></div>
          </div>
        </label>
      </div>

    </div>
  );
};

export default Setting;