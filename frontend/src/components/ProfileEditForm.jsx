import React from 'react'
import { FaImage, FaUser, FaCity, FaInfoCircle, FaBirthdayCake, FaSignature } from 'react-icons/fa';
import { Loader } from "../components/Spinner";
import { motion } from 'framer-motion';

const ProfileEditForm = ({
  loading,
  formData,
  profilePicURL,
  handleImageUpload,
  handleInputChange,
  handleSubmit,
  handleCancel,
}) => {
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/30 flex justify-center items-center backdrop-blur-sm"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="bg-white p-6 rounded-xl w-1/2 px-10">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            <label className="border-2 rounded-2xl border-dashed border-purple-300 p-6 w-full flex flex-col sm:flex-row items-center justify-center gap-6 cursor-pointer transition-all duration-300 hover:bg-white/70 hover:border-purple-400">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex flex-row items-center gap-10 text-gray-500">
                <div className="flex flex-col items-center gap-2 text-purple-500 text-center">
                  <FaImage className="text-4xl" />
                  <span className="text-xl">Upload New Photo</span>
                </div>
                {profilePicURL &&
                  <img src={profilePicURL} className="w-24 h-24 rounded-full object-cover" />
                }
                {loading &&
                  <Loader loading={loading} />
                }
              </div>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* THEME CHANGE: Themed inputs with icons and modern styling */}
              <div className="relative group">

                <label className="block text-slate-600 font-semibold mb-1">Username</label>
                <FaUser className="absolute left-3 top-10 text-slate-400 group-focus-within:text-purple-500" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500"
                  placeholder="Your unique username" />
              </div>

              <div className="relative group">
                <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
                <FaSignature className="absolute left-3 top-10 text-slate-400 group-focus-within:text-purple-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500"
                  placeholder="Your full name" />
              </div>

              <div className="relative group">
                <label className="block text-slate-600 font-semibold mb-1">City</label>
                <FaCity className="absolute left-3 top-10 text-slate-400 group-focus-within:text-purple-500" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500"
                  placeholder="Where you live" />
              </div>

              <div className="relative group">
                <label className="block text-slate-600 font-semibold mb-1">Date of Birth</label>
                <FaBirthdayCake className="absolute left-3 top-10 text-slate-400 group-focus-within:text-purple-500" />
                <input
                  type="date"
                  name="dob"
                  value={formData.dob.split('T')[0]}
                  onChange={handleInputChange}
                  className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500 text-slate-700" />
              </div>

              <div className="relative group md:col-span-2">
                <label className="block text-slate-600 font-semibold mb-1">Bio</label>
                <FaInfoCircle className="absolute left-3 top-10 text-slate-400 group-focus-within:text-purple-500" />
                <input
                  type="text"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500"
                  placeholder="Tell us about yourself" />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <motion.button
                type="button"
                onClick={handleCancel}
                className="cursor-pointer px-5 py-2 bg-transparent text-slate-600 font-semibold rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >Cancel
              </motion.button>

              <motion.button
                type="submit"
                className="cursor-pointer px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-md shadow-purple-200/80"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >Save Changes
              </motion.button>

            </div>
          </form>
        </div>
      </motion.div>
    </>
  )
}

export default ProfileEditForm



