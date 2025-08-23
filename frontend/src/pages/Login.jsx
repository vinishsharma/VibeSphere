import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

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

  // --- NEW: Function to handle Google login success ---
  const handleGoogleSuccess = async (credentialResponse) => {
    try {

      // console.log("Google Credential Response:", credentialResponse);

      // Send the authorization code to your backend
      const response = await axios.post("/api/auth/google-login", {
        credential: credentialResponse.credential,
      });

      // On success, update auth context and navigate
      if (response.data.user) {
        setUser(response.data.user);
      }
      toast.success("Welcome! You're signed in with Google.");
      navigate("/profile");

    } catch (error) {
      toast.error("Google Sign-In failed. Please try again.");
      console.error("Google Sign-In Error:", error);
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


        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-slate-300"></div>
          <span className="mx-4 text-slate-500 font-semibold">OR</span>
          <div className="flex-grow border-t border-slate-300"></div>
        </div>

        {/* --- NEW GOOGLE LOGIN BUTTON --- */}
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast.error('Google Login Failed');
            }}
            flow="auth-code" // This specifies we want the authorization code flow
            width="320px"
            theme="outline"
            shape="pill"
          />
        </div>


      </motion.div>
    </div>
  );
};

export default Login;