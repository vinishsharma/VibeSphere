import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaRegUser, FaEye, FaEyeSlash } from "react-icons/fa";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("/api/auth/signup", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setMessage(response.data.message || "Signup Successful!");
      console.log("Signup Response:", response.data);

      //Update auth context (without reloading)
      if (response.data.user) {
        setUser(response.data.user);
      }

      // Redirect on successful login
      toast.success("Registered Successfully");
      navigate("/profile");

    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center w-[70%] mx-auto py-18">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg ring-gray-200 ring-1">
        <h2 className="text-2xl font-bold text-center text-[#163049] mb-6">
          Create an Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#163049]" />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163049]"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Name Field */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <div className="relative">
              <FaRegUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#163049]" />
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163049]"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#163049]" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163049]"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#163049]" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163049]"
                onChange={handleChange}
                required
              />
              {/* Show/Hide Password Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#163049] text-white py-3 rounded-lg font-semibold hover:bg-[#1d2731] hover:cursor-pointer transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;