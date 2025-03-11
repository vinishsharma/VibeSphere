import React from "react";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes, FaUser, FaHome, FaSearch, FaPlus, FaCog } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";

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
    <nav className={`bg-white shadow-md px-10 py-3 flex ${user ? "justify-between" : "justify-center"} items-center sticky top-0 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto`}>

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
        <div className="flex gap-10">
          <NavLink to="/" className={({ isActive }) => `${isActive ? "border-b-2 border-b-[#163049]" : ""} flex items-center gap-1 p-1`}>
            <FaHome size={20} />
            <p>Home</p>
          </NavLink>

          <NavLink to="/create-post" className={({ isActive }) => `${isActive ? "border-b-2 border-b-[#163049]" : ""} flex items-center gap-1 p-1`}>
            <div className="border-black border-2 text-black rounded-md w-5 h-5 flex items-center justify-center">
              <FaPlus size={12} />
            </div>
            <p>Create</p>
          </NavLink>

          <NavLink to="/search-user" className={({ isActive }) => `${isActive ? "border-b-2 border-b-[#163049]" : ""} flex items-center gap-1 p-1`}>
            <FaSearch />
            <p>Search</p>
          </NavLink>
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
              <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg ring-1 ring-gray-200 w-40">
                <ul className="">
                  <li>
                    <Link to="/profile" onClick={toggleMenu} className="flex items-center gap-6 hover:bg-gray-100 p-4 cursor-pointer w-full">
                      <FaUser size="20" /> <p>My Profile</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="#" onClick={toggleMenu} className="flex items-center gap-6 hover:bg-gray-100 p-4 cursor-pointer w-full">
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