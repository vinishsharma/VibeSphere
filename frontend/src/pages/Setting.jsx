import React, { useState } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaTrashAlt, FaEye, FaEyeSlash, FaKey } from 'react-icons/fa';
import { FiEdit, FiShield, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

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
    // THEME CHANGE: Full-page animated gradient background
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient-x p-4 mt-8">
      <motion.div
        className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* THEME CHANGE: Gradient header text */}
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Account Settings
        </h1>

        {/* THEME CHANGE: Main settings card with glass effect */}
        <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-2xl shadow-purple-200/50 space-y-4">

          {/* Change Password Setting */}
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Change Password</h2>
              <p className="text-sm text-slate-500">Update your password to keep your account secure.</p>
            </div>
            <motion.button onClick={() => setIsChangePass(true)} className="flex items-center gap-2 px-4 py-2 bg-transparent border border-purple-400 text-purple-600 rounded-full font-semibold text-sm hover:bg-purple-500 hover:text-white transition-all duration-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <FiEdit />Change
            </motion.button>
          </div>

          <hr className="border-purple-200/50" />

          {/* Privacy Toggle Setting */}
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Private Account</h2>
              <p className="text-sm text-slate-500">If enabled, only your followers can see your posts.</p>
            </div>
            {/* THEME CHANGE: Custom themed toggle switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={user.isAccountPrivate} onChange={handleTogglePrivacy} />
              <div className="w-14 h-7 bg-slate-300 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-500 transition-all duration-300"></div>
              <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-7"></div>
            </label>
          </div>

          <hr className="border-purple-200/50" />

          {/* Delete Account Setting */}
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-lg font-bold text-red-600">Delete Your Account</h2>
              <p className="text-sm text-slate-500">All your posts and data will be permanently deleted and cannot be recovered in the future.</p>
            </div>
            <motion.button onClick={handleDeleteAccount} className="flex gap-2 items-center px-4 py-2 bg-red-500 text-white rounded-full font-semibold text-sm hover:bg-red-600 transition-all duration-300 shadow-md shadow-red-200" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <FaTrashAlt />Delete
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* THEME CHANGE: Themed Change Password Modal */}
      <AnimatePresence>
        {isChangePass && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl w-full max-w-md shadow-2xl shadow-purple-200/50 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <button onClick={handleCancel} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"><FiX size={24} /></button>
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">Update Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-6">

                <div className="relative group">
                  <label className="block text-slate-600 font-semibold mb-1">Old Password</label>
                  <FaKey className="absolute left-3 top-10 text-slate-400 group-focus-within:text-purple-500" />
                  <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleInputChange} className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500" placeholder="Enter old password" />
                </div>

                <div className="relative group">
                  <label className="block text-slate-600 font-semibold mb-1">New Password</label>
                  <FaKey className="absolute left-3 top-10 text-slate-400 group-focus-within:text-purple-500" />
                  <input type={showPassword ? "text" : "password"} name="newPassword" value={formData.newPassword} onChange={handleInputChange} className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500" placeholder="Enter new password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-10 text-slate-500">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                </div>

                <div className="relative group">
                  <label className="block text-slate-600 font-semibold mb-1">Confirm Password</label>
                  <FaKey className="absolute left-3 top-10 text-slate-400 group-focus-within:text-purple-500" />
                  <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500" placeholder="Confirm new password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-10 text-slate-500">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <motion.button type="button" onClick={handleCancel} className="px-5 py-2 bg-transparent text-slate-600 font-semibold" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Cancel</motion.button>
                  <motion.button type="submit" className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-md shadow-purple-200/80" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Update</motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Setting;