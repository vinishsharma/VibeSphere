// import React, { useState } from "react";
// import { toast } from 'react-toastify';
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { FaTrashAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
// import { FiEdit } from 'react-icons/fi';

// const Setting = () => {
//   const { user, setUser, logout } = useAuth();
//   const [isChangePass, setIsChangePass] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleTogglePrivacy = async () => {
//     try {
//       const response = await axios.put("/api/user/toggle-privacy",
//         {},
//         { withCredentials: true }
//       );

//       // Update AuthContext with the new privacy setting without reloading
//       setUser((prevUser) => ({
//         ...prevUser,
//         isAccountPrivate: response.data.isAccountPrivate,
//       }));

//       toast.success(`Your account is now ${response.data.isAccountPrivate ? "Private" : "Public"}`);
//     } catch (error) {
//       console.error("Error updating privacy:", error);
//       toast.error(response.data.error.message || "Error updating privacy");
//     }
//   };

//   const handleDeleteAccount = async () => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete your account? This action is irreversible!"
//     );
//     if (confirmDelete) {
//       const response = await axios.delete('/api/user/delete');
//       // console.log(response);
//       logout();
//       toast.success("Account Deleted Successfully");
//     }
//   };

//   const handleChangePassword = async (e) => {
//     e.preventDefault();

//     if (formData.newPassword !== formData.confirmPassword) {
//       toast.error("New passwords do not match!");
//       return;
//     }

//     try {
//       const response = await axios.put("/api/user/update-password", formData, {
//         withCredentials: true,
//       });

//       toast.success(response.data.message);
//       setIsChangePass(false);
//       setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" }); // Reset form after success
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error updating password");
//       toast.error(error.response.data.errors[0].message);
//     }
//   };

//   const handleCancel = () => {
//     setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
//     setIsChangePass(false);
//   }

//   return (
//     <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto py-10 min-h-[90vh]  px-2">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Settings</h2>

//       {/* Edit Your Password */}
//       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6 ring-1 ring-gray-100 shadow-md">
//         <div>
//           <h1 className="text-lg font-semibold">Change Password</h1>
//           <p className="text-sm text-gray-600">Update your password to keep your account secure.</p>
//         </div>
//         <button
//           onClick={() => { setIsChangePass(true) }}
//           className="flex items-center gap-2 px-3 py-1 border-1 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition cursor-pointer"
//         >
//           <FiEdit />Change
//         </button>
//       </div>

//       {/* Privacy Toggle */}
//       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6 ring-1 ring-gray-100 shadow-md">
//         <div>
//           <h1 className="text-lg font-semibold">Make Account Private</h1>
//           <p className="text-sm text-gray-600">All your uploaded posts will be visible only to your followers.</p>
//         </div>
//         <label className="relative inline-flex items-center cursor-pointer">
//           <input
//             type="checkbox"
//             className="sr-only peer"
//             checked={user.isAccountPrivate}
//             onChange={handleTogglePrivacy}
//           />
//           <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors relative">
//             <div
//               className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all transform ${user.isAccountPrivate ? "translate-x-6" : "translate-x-0"
//                 }`}
//             ></div>
//           </div>
//         </label>
//       </div>

//       {/* Delete Account Button */}
//       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6 ring-1 ring-gray-100 shadow-md">
//         <div>
//           <h1 className="text-lg font-semibold">Delete Your Account</h1>
//           <p className="text-sm text-gray-600">All your posts and data will be permanently deleted and cannot be recovered in the future.</p>
//         </div>
//         <button
//           onClick={handleDeleteAccount}
//           className="flex gap-2 items-center px-3 py-1 border-1 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition cursor-pointer"
//         >
//           <FaTrashAlt />
//           Delete
//         </button>
//       </div>

//       {isChangePass &&
//         <div className="fixed inset-0 bg-[#22222277] flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg w-1/3">
//             <h2 className="text-2xl font-bold mb-4 text-center text-[#163049]">Update Passoword</h2>
//             <form onSubmit={handleChangePassword} className="flex gap-4 flex-col">
//               <label htmlFor="oldPassword">Old Password
//                 <input
//                   type="password"
//                   name="oldPassword"
//                   id="oldPassword"
//                   value={formData.oldPassword}
//                   onChange={handleInputChange}
//                   className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#163049]"
//                   placeholder="Enter old password"
//                 />
//               </label>
//               <label htmlFor="newPassword">New Password
//                 <div className="relative w-full">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="newPassword"
//                     id="newPassword"
//                     value={formData.newPassword}
//                     onChange={handleInputChange}
//                     className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#163049] pr-10" // Add pr-10 for spacing
//                     placeholder="Enter new password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>
//               </label>
//               <label htmlFor="confirmPassword">Confirm Password
//                 <div className="relative w-full">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     id="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#163049] pr-10" // Add pr-10 for spacing
//                     placeholder="Confirm your password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>
//               </label>
//               <div className="flex justify-between">
//                 <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:opacity-100 opacity-80">Update</button>
//                 <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer hover:opacity-100 opacity-80">Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       }
//     </div>
//   );
// };

// export default Setting;














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
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient-x p-4 py-12">
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