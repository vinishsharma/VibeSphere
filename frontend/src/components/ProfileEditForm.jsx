import React from 'react'
import { FaImage } from 'react-icons/fa';
import { Loader } from "../components/Spinner";

const ProfileEditForm = ({
  loading,
  formData,
  profilePicURL,
  handleImageUpload,
  handleInputChange,
  handleSubmit,
  handleCancel,
  setProfilePicURL
}) => {
  return (
    <>
      <div className="fixed inset-0 bg-[#22222277] flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-1/3">
          <h2 className="text-2xl font-bold mb-4 text-center text-[#163049]">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            <label className="border-2 rounded-lg border-dashed border-gray-400 p-6 w-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex flex-row items-center gap-10 text-gray-500">
                <div className="flex flex-col items-center">
                  <FaImage className="text-2xl" />
                  <span className="text-xl">Upload Profile Image</span>
                </div>
                {profilePicURL &&
                  <img src={profilePicURL} className="w-24 h-24 rounded-full object-cover" />
                }
                {loading &&
                  <Loader loading={loading} />
                }
              </div>
            </label>

            <label htmlFor="username">Username
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full border p-2 rounded mb-2 focus:outline-none focus:ring-1 focus:ring-[#163049]"
                placeholder="Username"
              />
            </label>

            <label htmlFor="name">Full Name
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border p-2 rounded mb-2 focus:outline-none focus:ring-1 focus:ring-[#163049]"
                placeholder="Name"
              />
            </label>

            <label htmlFor="city">City
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border p-2 rounded mb-2 focus:outline-none focus:ring-1 focus:ring-[#163049]"
                placeholder="City"
              />
            </label>

            <label htmlFor="bio">About Me
              <input
                type="text"
                name="bio"
                id="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full border p-2 rounded mb-2 focus:outline-none focus:ring-1 focus:ring-[#163049]"
                placeholder="Bio"
              />
            </label>

            <label htmlFor="dob">Date of Birth
              <input
                type="date"
                name="dob"
                id="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-1 focus:ring-[#163049]"
              />
            </label>

            <div className="flex justify-between">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:opacity-100 opacity-80">Save</button>
              <button type="button" onClick={() => { handleCancel(); setProfilePicURL("") }} className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer hover:opacity-100 opacity-80">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ProfileEditForm