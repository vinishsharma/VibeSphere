import React, { useState } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaTrashAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';

const Setting = () => {
  const { user, setUser, logout } = useAuth();
  const [isChangePass, setIsChangePass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePrivacy = async () => {
    try {
      const response = await axios.put("/api/user/toggle-privacy",
        {},
        { withCredentials: true }
      );

      // Update AuthContext with the new privacy setting without reloading
      setUser((prevUser) => ({
        ...prevUser,
        isAccountPrivate: response.data.isAccountPrivate,
      }));

      toast.success(`Your account is now ${response.data.isAccountPrivate ? "Private" : "Public"}`);
    } catch (error) {
      console.error("Error updating privacy:", error);
      toast.error(response.data.error.message || "Error updating privacy");
    }
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

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      const response = await axios.put("/api/user/update-password", formData, {
        withCredentials: true,
      });

      toast.success(response.data.message);
      setIsChangePass(false);
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" }); // Reset form after success
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating password");
      toast.error(error.response.data.errors[0].message);
    }
  };

  const handleCancel = () => {
    setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setIsChangePass(false);
  }

  return (
    <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto py-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>

      {/* Edit Your Password */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6 ring-1 ring-gray-100 shadow-md">
        <div>
          <h1 className="text-lg font-semibold">Change Password</h1>
          <p className="text-sm text-gray-600">Update your password to keep your account secure.</p>
        </div>
        <button
          onClick={() => { setIsChangePass(true) }}
          className="flex items-center gap-2 px-3 py-1 border-1 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition cursor-pointer"
        >
          <FiEdit />Change
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
            checked={user.isAccountPrivate}
            onChange={handleTogglePrivacy}
          />
          <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors relative">
            <div
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all transform ${user.isAccountPrivate ? "translate-x-6" : "translate-x-0"
                }`}
            ></div>
          </div>
        </label>
      </div>

      {/* Delete Account Button */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6 ring-1 ring-gray-100 shadow-md">
        <div>
          <h1 className="text-lg font-semibold">Delete Your Account</h1>
          <p className="text-sm text-gray-600">All your posts and data will be permanently deleted and cannot be recovered in the future.</p>
        </div>
        <button
          onClick={handleDeleteAccount}
          className="flex gap-2 items-center px-3 py-1 border-1 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition cursor-pointer"
        >
          <FaTrashAlt />
          Delete
        </button>
      </div>

      {isChangePass &&
        <div className="fixed inset-0 bg-[#22222277] flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4 text-center text-[#163049]">Update Passoword</h2>
            <form onSubmit={handleChangePassword} className="flex gap-4 flex-col">
              <label htmlFor="oldPassword">Old Password
                <input
                  type="password"
                  name="oldPassword"
                  id="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#163049]"
                  placeholder="Enter old password"
                />
              </label>
              <label htmlFor="newPassword">New Password
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#163049] pr-10" // Add pr-10 for spacing
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>
              <label htmlFor="confirmPassword">Confirm Password
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#163049] pr-10" // Add pr-10 for spacing
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>
              <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:opacity-100 opacity-80">Update</button>
                <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer hover:opacity-100 opacity-80">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  );
};

export default Setting;