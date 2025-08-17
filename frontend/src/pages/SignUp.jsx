// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { toast } from 'react-toastify';
// import { FaUser, FaEnvelope, FaLock, FaRegUser, FaEye, FaEyeSlash } from "react-icons/fa";

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   const { setUser } = useAuth();

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     try {
//       const response = await axios.post("/api/auth/signup", formData, {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       setMessage(response.data.message || "Signup Successful!");
//       console.log("Signup Response:", response.data);

//       //Update auth context (without reloading)
//       if (response.data.user) {
//         setUser(response.data.user);
//       }

//       // Redirect on successful login
//       toast.success("Registered Successfully");
//       navigate("/profile");

//     } catch (err) {
//       // console.log(err.response.data.errors[0].message);
//       setError(err.response?.data?.message || "Signup failed");
//       toast.error(err.response?.data?.message || "Signup failed");
//       toast.error(err.response.data.errors[0].message);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center w-[70%] mx-auto min-h-[90vh] ">
//       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg ring-gray-200 ring-1">
//         <h2 className="text-2xl font-bold text-center text-[#163049] mb-6">
//           Create an Account
//         </h2>

//         <form className="space-y-4" onSubmit={handleSubmit}>
//           {/* Username Field */}
//           <div className="relative">
//             <label className="block text-gray-700 font-medium mb-1">Username</label>
//             <div className="relative">
//               <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#163049]" />
//               <input
//                 type="text"
//                 name="username"
//                 placeholder="Enter your username"
//                 className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163049]"
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           {/* Name Field */}
//           <div className="relative">
//             <label className="block text-gray-700 font-medium mb-1">Name</label>
//             <div className="relative">
//               <FaRegUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#163049]" />
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Enter your name"
//                 className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163049]"
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           {/* Email Field */}
//           <div className="relative">
//             <label className="block text-gray-700 font-medium mb-1">Email</label>
//             <div className="relative">
//               <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#163049]" />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163049]"
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           {/* Password Field */}
//           <div className="relative">
//             <label className="block text-gray-700 font-medium mb-1">Password</label>
//             <div className="relative">
//               <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#163049]" />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Enter your password"
//                 className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163049]"
//                 onChange={handleChange}
//                 required
//               />
//               {/* Show/Hide Password Button */}
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-[#163049] text-white py-3 rounded-lg font-semibold hover:bg-[#1d2731] hover:cursor-pointer transition"
//           >
//             Sign Up
//           </button>
//         </form>

//         <p className="text-center text-gray-600 mt-4">
//           Already have an account?{" "}
//           <a href="/login" className="text-blue-500 hover:underline">
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignUp;







import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaRegUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from 'framer-motion';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/signup", formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.user) {
        setUser(response.data.user);
      }

      toast.success("Welcome to VibeSphere!");
      navigate("/profile"); // Redirect to my profile on successful signup

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach(error => toast.error(error.message));
      }
    }
  };

  return (
    // THEME CHANGE: Full-page animated gradient background
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient-x p-4">
      <motion.div
        className="w-full max-w-md bg-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl shadow-purple-200/50 ring-1 ring-purple-200"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
      >
        {/* THEME CHANGE: Gradient text for the header */}
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Join VibeSphere
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* All input fields are now themed */}
          <div className="relative group">
            <label className="block text-slate-600 font-semibold mb-1">Username</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors duration-300" />
              <input type="text" name="username" placeholder="Choose a unique username" className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500 transition-colors duration-300" onChange={handleChange} required />
            </div>
          </div>

          <div className="relative group">
            <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
            <div className="relative">
              <FaRegUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors duration-300" />
              <input type="text" name="name" placeholder="Enter your full name" className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500 transition-colors duration-300" onChange={handleChange} required />
            </div>
          </div>

          <div className="relative group">
            <label className="block text-slate-600 font-semibold mb-1">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors duration-300" />
              <input type="email" name="email" placeholder="you@example.com" className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500 transition-colors duration-300" onChange={handleChange} required />
            </div>
          </div>

          <div className="relative group">
            <label className="block text-slate-600 font-semibold mb-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors duration-300" />
              <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500 transition-colors duration-300" onChange={handleChange} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-lg font-semibold shadow-lg shadow-purple-200/80 cursor-pointer"
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(192, 132, 252, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            Create Account
          </motion.button>
        </form>

        <p className="text-center text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;