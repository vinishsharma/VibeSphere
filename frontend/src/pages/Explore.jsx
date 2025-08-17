import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar'; // Make sure the path is correct
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader } from '../components/Spinner';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/post/get-all-except-my');
        setPosts(response.data.posts);
        setFilteredPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
      return;
    }
    const filtered = posts.filter(post =>
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredPosts(filtered);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredPosts(posts);
  };

  // Navigate to post detail page
  const handleViewPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient-x p-4 mt-8'>
      <motion.div
        className='w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Discover New Vibes
        </h1>

        <div className='flex justify-center mb-10'>
          <div className="w-full max-w-2xl bg-white/60 backdrop-blur-md p-3 rounded-full shadow-lg shadow-purple-200/50">
            <SearchBar
              placeholder={"Search by tags..."}
              value={searchQuery}
              onChange={({ target }) => setSearchQuery(target.value)}
              onClear={clearSearch}
              handleSearch={handleSearch}
            />
          </div>
        </div>

        <motion.div
          key={filteredPosts.map(p => p._id).join('-')} // A more robust key for re-animation
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            <p className="col-span-full text-center text-slate-600"><Loader /></p>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <motion.div
                key={post._id}
                className="w-full aspect-square rounded-2xl overflow-hidden cursor-pointer ring-1 ring-white/50"
                variants={itemVariants}
                whileHover={{ scale: 1.05, zIndex: 10, boxShadow: "0px 20px 30px rgba(168, 85, 247, 0.3)" }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => handleViewPost(post._id)}
              >
                {post.media.type === "image" ? (
                  <img src={post.media.url} alt="Post" className="w-full h-full object-cover" />
                ) : (
                  <video autoPlay muted loop className="w-full h-full object-cover">
                    <source src={post.media.url} type="video/mp4" />
                  </video>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full flex items-center justify-center min-h-[40vh] p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className='flex justify-center flex-col items-center text-center bg-white/60 backdrop-blur-md rounded-2xl p-10 shadow-lg shadow-purple-100/50'>
                <div className="p-5 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mb-6">
                  <FaSearch size={50} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">No Vibes Found</h3>
                <p className="text-slate-500 mt-2">Try a different tag or clear the search to see all posts.</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Explore;