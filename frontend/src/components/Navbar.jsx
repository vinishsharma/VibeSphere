import React from "react";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes, FaUser, FaSearch, FaCog, FaCompass } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { CgAddR } from "react-icons/cg";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

  // THEME CHANGE: Styles for the new high-contrast "pill" navigation
  const activeLinkStyle = "border-white bg-[#163049] text-white shadow-md";
  const defaultLinkStyle = "border-slate-500 text-slate-500";

  return (
    // THEME CHANGE: Floating pill design with an animated gradient background
    <div className="pt-4">
      <div className={`bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 p-3 flex ${user ? "justify-between" : "justify-center"} items-center w-full sm:w-full md:w-[80%] lg:w-[70%] mx-auto rounded-full shadow-lg shadow-black/10  z-10`}>
        {/* Left Section: Logo & Name */}
        <Link to='/'>
          <div className="flex items-center space-x-3 ml-2">
            <img src="/logo/mainLogo.svg" alt="VibeSphere Logo" className="h-auto w-[7vh]" />
            <div>
              {/* THEME CHANGE: Gradient text for a beautiful "wow" effect */}
              <h1 className="alata-regular text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">VibeSphere</h1>
              <p className="aclonica-regular text-sm text-slate-500">your moments, your vibe</p>
            </div>
          </div>
        </Link>

        {/* Mid Section: Navigation Links */}
        {user && (
          <div className="flex items-center gap-2">
            <NavLink to="/create-post" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-semibold ${isActive ? activeLinkStyle : defaultLinkStyle} hover:text-pink-400`}>
              <CgAddR size={20} />
              <p>Create</p>
            </NavLink>

            <NavLink to="/explore" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-semibold ${isActive ? activeLinkStyle : defaultLinkStyle} hover:text-pink-400`}>
              <FaCompass size={18} />
              <p>Explore</p>
            </NavLink>

            <NavLink to="/search-user" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-semibold ${isActive ? activeLinkStyle : defaultLinkStyle} hover:text-pink-400`}>
              <FaSearch size={18} />
              <p>Search</p>
            </NavLink>
          </div>
        )}

        {/* Right Section: Logged In user profile */}
        {user && (
          <div className="flex items-center gap-4 mr-2">
            <Link to="/profile" className="transition-transform duration-200 hover:scale-110">
              <img
                src={user.profilePicture || "profile.jpg"}
                alt="Profile"
                // THEME CHANGE: Themed ring around profile picture
                className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-300 ring-offset-2 ring-offset-white/50"
              />
            </Link>

            <div ref={dropdownRef} className="relative">
              <button className="text-2xl text-slate-700 cursor-pointer transition-transform duration-200 hover:rotate-90" onClick={toggleMenu}>
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
              {isMenuOpen && (
                // THEME CHANGE: Dropdown is now a clean, floating card
                <div className="absolute top-14 right-0 bg-white shadow-2xl rounded-2xl ring-1 ring-purple-100 w-52 z-50 p-2">
                  <div className="p-4 border-b border-slate-200">
                    <p className="font-bold text-slate-800 text-lg">{user.name.split(" ")[0]}</p>
                    <p className="text-sm text-slate-500">@{user.username}</p>
                  </div>
                  <ul className="text-slate-700 font-medium">
                    <li>
                      <Link to="/profile" onClick={toggleMenu} className="flex items-center gap-4 hover:bg-purple-50 hover:text-purple-600 p-3 cursor-pointer w-full transition-colors duration-200 rounded-lg">
                        <FaUser /> <p>My Profile</p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/setting" onClick={toggleMenu} className="flex items-center gap-4 hover:bg-purple-50 hover:text-purple-600 p-3 cursor-pointer w-full transition-colors duration-200 rounded-lg">
                        <FaCog /> <p>Settings</p>
                      </Link>
                    </li>
                    <li>
                      <button onClick={logout} className="flex items-center gap-4 hover:bg-red-50 hover:text-red-600 text-red-500 p-3 cursor-pointer w-full transition-colors duration-200 rounded-lg">
                        <FiLogOut /> <p>Logout</p>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;