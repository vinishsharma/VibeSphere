import React from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, loading } = useAuth();
  console.log(user);

  return (
    <nav className="bg-white shadow-md px-6 flex justify-between items-center">
      {/* Left Side (Empty to balance the center) */}
      <div className="w-16"></div>

      {/* Center: Logo & Name */}
      <div className="flex items-center space-x-2">
        <img src="/logo/vibeLogo.png" alt="VibeSphere Logo" className="h-auto w-24" />
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">VibeSphere</h1>
          <p className="text-sm text-gray-800">your moments, your vibe</p>
        </div>
      </div>

      {/* Right Side: Profile Icon */}
      <div className="flex items-center">
        <img
          src={`profile.jpeg`}
          alt="Profile"
          className="h-10 w-10 rounded-full border border-gray-300 cursor-pointer"
        />
        {user &&
          <div className="px-4 text-xl">{user.name}</div>
        }
      </div>
    </nav>
  );
};

export default Navbar;