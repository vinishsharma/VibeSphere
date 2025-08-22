import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaRegUser, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import { motion } from 'framer-motion';

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/auth/send-otp", formData);
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/verifysignup", { email: formData.email, otp }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.user) {
        setUser(response.data.user);
      }

      toast.success("Welcome to VibeSphere! Signup successful.");
      navigate("/profile");

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen p-4 animate-gradient-x">
      <motion.div
        className="w-full max-w-md bg-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl shadow-purple-200/50 ring-1 ring-purple-200"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
      >
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          {step === 1 ? 'Join VibeSphere' : 'Verify Your Email'}
        </h2>

        {step === 1 && (
          <form className="space-y-6" onSubmit={handleSendOtp}>
            <div className="relative group">
              <label className="block text-slate-600 font-semibold mb-1">Username</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500" />
                <input type="text" name="username" placeholder="Choose a unique username" className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500" onChange={handleChange} required />
              </div>
            </div>
            <div className="relative group">
              <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
              <div className="relative">
                <FaRegUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500" />
                <input type="text" name="name" placeholder="Enter your full name" className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500" onChange={handleChange} required />
              </div>
            </div>
            <div className="relative group">
              <label className="block text-slate-600 font-semibold mb-1">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500" />
                <input type="email" name="email" placeholder="you@example.com" className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500" onChange={handleChange} required />
              </div>
            </div>
            <div className="relative group">
              <label className="block text-slate-600 font-semibold mb-1">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500" />
                <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500" onChange={handleChange} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <motion.button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-lg font-semibold shadow-lg shadow-purple-200/80 cursor-pointer disabled:opacity-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {isLoading ? 'Sending...' : 'Send OTP'}
            </motion.button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-6" onSubmit={handleVerifyAndSignup}>
            <p className="text-center text-slate-600">Enter the 6-digit OTP sent to <span className="font-bold">{formData.email}</span></p>
            <div className="relative group">
              <label className="block text-slate-600 font-semibold mb-1">OTP Code</label>
              <div className="relative">
                <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500" />
                <input
                  type="text"
                  name="otp"
                  placeholder="123456"
                  className="w-full pl-10 p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500"
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  required
                />
              </div>
            </div>
            <motion.button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-green-400 to-blue-400 text-white py-3 rounded-lg font-semibold shadow-lg shadow-blue-200/80 cursor-pointer disabled:opacity-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {isLoading ? 'Verifying...' : 'Verify & Create Account'}
            </motion.button>
            <p className="text-center text-sm text-slate-500">
              Didn't receive the code?{" "}
              <button type="button" onClick={handleSendOtp} className="text-purple-600 font-semibold hover:underline" disabled={isLoading}>
                Resend OTP
              </button>
            </p>
          </form>
        )}

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