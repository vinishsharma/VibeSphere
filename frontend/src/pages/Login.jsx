// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { toast } from 'react-toastify';
// import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const { setUser } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("/api/auth/login", { email, password }, {
//         withCredentials: true,      // Enables HTTP-Only cookies
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//       );

//       //Update auth context (without reloading)
//       if (response.data.user) {
//         setUser(response.data.user);
//       }

//       // Redirect on successful login
//       toast.success("Login Successful");
//       navigate("/profile");
//     } catch (err) {
//       // console.log(err.response.data);
//       setError(err.response?.data?.message || "Login failed");
//       toast.error(err.response?.data?.message || "Login failed");
//       toast.error(err.response?.data?.errors[0]?.message);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center w-[70%] mx-auto min-h-[90vh] ">
//       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg ring-gray-200 ring-1">
//         <h2 className="text-2xl font-bold text-center text-[#163049] mb-6">
//           Login to Your Account
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Email Field */}
//           <div className="relative">
//             <label className="block text-gray-700 font-medium mb-1">Email</label>
//             <div className="relative">
//               <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#163049]" />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163049]"
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
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163049]"
//                 required
//               />
//               {/* Show/Hide Password Icon */}
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
//             Login
//           </button>
//         </form>

//         <p className="text-center text-gray-600 mt-4">
//           Don't have an account?{" "}
//           <a href="/signup" className="text-blue-500 hover:underline">
//             Sign up
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;








import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Kept for potential future use
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", { email, password }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.user) {
        setUser(response.data.user);
      }
      toast.success("Welcome back!");
      navigate("/"); // Redirect to home/feed on successful login
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    }
  };

  return (
    // THEME CHANGE: Full-page animated gradient background
    <div className="flex items-center justify-center w-full min-h-[90vh] animate-gradient-x p-4">
      <motion.div
        className="w-full max-w-md bg-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl shadow-purple-200/50 ring-1 ring-purple-200"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
      >
        {/* THEME CHANGE: Gradient text for the header */}
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative group">
            <label className="block text-slate-600 font-semibold mb-1">Email</label>
            <div className="relative">
              {/* THEME CHANGE: Themed icon, changes color on focus-within */}
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors duration-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                // THEME CHANGE: Modern, underlined input style
                className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative group">
            <label className="block text-slate-600 font-semibold mb-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors duration-300" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500"
              >
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
            Login
          </motion.button>
        </form>

        <p className="text-center text-slate-500 mt-6">
          Don't have an account?{" "}
          {/* THEME CHANGE: Themed link color */}
          <Link to="/signup" className="text-purple-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;