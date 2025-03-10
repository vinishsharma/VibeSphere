import React from "react";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md px-6 flex justify-between items-center">

      {/* Left Side: Logo & Name */}
      <div className="flex items-center space-x-2">
        <img src="/logo/vibeLogo.png" alt="VibeSphere Logo" className="h-auto w-24" />
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">VibeSphere</h1>
          <p className="text-sm text-gray-800">your moments, your vibe</p>
        </div>
      </div>

      {/* Right Side: Logged In user profile*/}
      {user && (
        <div className="flex items-center">
          <img
            src="profile.jpeg"
            // src={user.profilePicture}
            alt="Profile"
            className="h-10 w-10 rounded-full border border-gray-300"
          />
          <div className="px-4 text-xl">{user.name.split(" ")[0]}</div>

          <div ref={dropdownRef} className="relative">
            <button className="text-2xl" onClick={toggleMenu}>{isMenuOpen ? <FaTimes /> : <FaBars />}</button>
            {isMenuOpen && (
              <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg ring-1 ring-gray-200">
                <ul className="">
                  <li>
                    <a href="/profile" className="flex items-center gap-6 hover:bg-gray-100 p-4 cursor-pointer">
                      <FaUser /> <p>Profile</p>
                    </a>
                  </li>
                  <li>
                    <button onClick={logout} className="flex items-center gap-6 hover:bg-gray-100 p-4 cursor-pointer">
                      <FiLogOut /> <p>Logout</p>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

        </div>
      )}
    </nav>
  );
};

export default Navbar;