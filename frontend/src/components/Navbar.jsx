import React from "react";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes, FaUser, FaHome, FaSearch, FaPlus, FaCog, FaCompass } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
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
    <nav className={`bg-white shadow-md px-4 py-3 flex ${user ? "justify-between" : "justify-center"} items-center w-full sm:w-[w-full] md:w-[80%] lg:w-[70%] mx-auto`}>

      {/* Left Section: Logo & Name */}
      <Link to='/'>
        <div className="flex items-center space-x-2">
          <img src="/logo/mainLogo.svg" alt="VibeSphere Logo" className="h-auto w-16" />
          <div className="">
            <h1 className="alata-regular text-3xl font-semibold text-[#163049]">VibeSphere</h1>
            <p className="aclonica-regular text-sm text-[#163049]">your moments, your vibe</p>
          </div>
        </div>
      </Link>


      {/* Mid Section: Home Liked Search */}
      {user && (
        <div className="flex gap-5">
          {/* <NavLink to="/" className={({ isActive }) => `${isActive ? "border-b-2 border-b-[#163049] text-lg transition-all duration-200 ease-in-out" : ""} flex text-[#163049] items-center gap-1`}>
            <FaHome size={20} />
            <p>Home</p>
          </NavLink> */}

          <NavLink to="/create-post" className={({ isActive }) => `${isActive ? "border-b-2 border-b-[#163049] text-lg transition-all duration-100 ease-in-out" : ""} flex text-[#163049] items-center gap-1`}>
            <div className="border-black border-2 rounded-md w-5 h-5 flex items-center justify-center">
              <FaPlus size={12} />
            </div>
            <p>Create</p>
          </NavLink>

          <NavLink to="/explore" className={({ isActive }) => `${isActive ? "border-b-2 border-b-[#163049] text-lg transition-all duration-100 ease-in-out" : ""} flex text-[#163049] items-center gap-1 `}>
            <FaCompass size={20} />
            <p>Explore</p>
          </NavLink>

          <NavLink to="/search-user" className={({ isActive }) => `${isActive ? "border-b-2 border-b-[#163049] text-lg transition-all duration-100 ease-in-out" : ""} flex text-[#163049] items-center gap-1 `}>
            <FaSearch />
            <p>Search</p>
          </NavLink>
        </div>
      )}

      {/* Right Section: Logged In user profile*/}
      {user && (
        <div className="flex items-center">
          <Link to="/profile">
            <img
              src={user.profilePicture || "profile.jpg"}
              alt="Profile"
              className="h-10 w-10 rounded-full border border-gray-300 object-cover"
            />
          </Link>
          {/* Display first name of logged-in user */}
          <div className="px-4 text-xl">{user.name.split(" ")[0]}</div>

          <div ref={dropdownRef} className="relative">
            <button className="text-2xl cursor-pointer" onClick={toggleMenu}>{isMenuOpen ? <FaTimes /> : <FaBars />}</button>
            {isMenuOpen && (
              <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg ring-1 ring-gray-200 w-40 z-[9999]">
                <ul className="">
                  <li>
                    <Link to="/profile" onClick={toggleMenu} className="flex items-center gap-6 hover:bg-gray-100 p-4 cursor-pointer w-full">
                      <FaUser size="20" /> <p>My Profile</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/setting" onClick={toggleMenu} className="flex items-center gap-6 hover:bg-gray-100 p-4 cursor-pointer w-full">
                      <FaCog size="20" /> <p>Setting</p>
                    </Link>
                  </li>
                  <li>
                    <button onClick={logout} className="flex items-center gap-6 hover:bg-gray-100 p-4 cursor-pointer w-full">
                      <FiLogOut size="20" color="red" /> <p>Logout</p>
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