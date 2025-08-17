import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import { FaSearch, FaUserAltSlash, FaUsers } from 'react-icons/fa';
import UserBar from '../components/UserBar.jsx';
import { motion } from 'framer-motion';

const SearchUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isSearchExecuted, setIsSearchExecuted] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/user/get-all-except-me");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = () => {
    // If empty string, reset to "typing phase"
    if (searchQuery.trim() === "") {
      setIsSearchExecuted(false);
      setFilteredUsers([]);
      return;
    }

    setIsSearchExecuted(true);

    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const clearSearch = () => {
    setFilteredUsers([]);
    setSearchQuery("");
    setIsSearchExecuted(false);
  };

  // Animation variants for the list
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    // THEME CHANGE: Full-page animated gradient background
    <div className='w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient-x p-4 mt-8'>
      <motion.div
        className='w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* THEME CHANGE: Gradient header text */}
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Connect with Others
        </h1>

        {/* THEME CHANGE: Floating glass container for the search bar */}
        <div className='flex justify-center mb-10'>
          <div className="w-full max-w-2xl bg-white/60 backdrop-blur-md p-3 rounded-full shadow-lg shadow-purple-200/50">
            <SearchBar
              placeholder={"Search users by name or username..."}
              value={searchQuery}
              onChange={({ target }) => setSearchQuery(target.value)}
              onClear={clearSearch}
              handleSearch={handleSearch}
            />
          </div>
        </div>

        {/* THEME CHANGE: Main content card with glass effect */}
        <motion.div
          className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-2xl shadow-purple-200/50 min-h-[50vh] flex flex-col"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {isSearchExecuted ? (
            filteredUsers.length > 0 ? (
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredUsers.map(curUser => (
                  <motion.div key={curUser._id} variants={itemVariants}>
                    <UserBar targetUser={curUser} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // THEME CHANGE: Themed "No Results" state
              <div className="flex flex-col flex-grow items-center justify-center text-center text-slate-500 p-8">
                <FaUserAltSlash size={80} className="mb-6 text-purple-300" />
                <h3 className="text-2xl font-bold text-slate-800">No Users Found</h3>
                <p className="mt-2">We couldn't find anyone matching that search. Try a different name!</p>
              </div>
            )
          ) : (
            // THEME CHANGE: Themed initial search prompt
            <div className="flex flex-col flex-grow items-center justify-center text-center text-slate-500 p-8">
              <FaUsers size={80} className="mb-6 text-purple-300" />
              <h3 className="text-2xl font-bold text-slate-800">Find Your People</h3>
              <p className="mt-2">Search for friends and other creators on VibeSphere.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SearchUser;