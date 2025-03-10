import React from "react";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes, FaUser, FaHome, FaSearch, FaPlus } from "react-icons/fa";
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
    <nav className={`bg-white shadow-md px-10 py-2 flex ${user ? "justify-between" : "justify-center"} items-center sticky top-0`}>

      {/* Left Section: Logo & Name */}
      <div className="flex items-center space-x-2">
        <img src="/logo/newLogo.svg" alt="VibeSphere Logo" className="h-auto w-16" />
        <div className="">
          <h1 className="text-3xl font-semibold text-[#163049]">VibeSphere</h1>
          <p className="text-sm text-[#163049]">your moments, your vibe</p>
        </div>
      </div>

      {/* Mid Section: Home Liked Search */}
      {user && (
        <div className="flex gap-10">
          <a href="/" className="flex items-center gap-1"><FaHome size={20} /><p>Home</p></a>
          <a href="#" className="flex items-center gap-1"><div className="border-black border-2 text-black rounded-md w-5 h-5 flex items-center justify-center">
            <FaPlus size={12} />
          </div><p>Create</p></a>
          {/* <a href="#" className="flex items-center gap-1"><FaPlus /><p>Create</p></a> */}
          <a href="#" className="flex items-center gap-1"><FaSearch /><p>Search</p></a>
        </div>
      )}

      {/* Right Section: Logged In user profile*/}
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