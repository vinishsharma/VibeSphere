import React, { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async (req, res) => {
      try {
        const response = await axios.get('/api/post/get-all-except-my');
        setPosts(response.data.posts);
        setFilteredPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts", error);
      }
    };

    fetchPosts();
  }, []);

  // ✅ Filter posts when search button is clicked or Enter is pressed
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts); // Reset if search query is empty
      return;
    }

    const filtered = posts.filter(post =>
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredPosts(filtered);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredPosts(posts); // Reset to all posts
  };

  return (
    <>
      <div className='w-full sm:w-[90%] md:w-[80%] lg:w-[70%] min-h-screen mx-auto py-10 '>
        <div className='flex justify-center'>
          <SearchBar
            placeholder={"Search Posts..."}
            value={searchQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value);
            }}
            onClear={clearSearch}
            handleSearch={handleSearch}
          />
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <div key={post._id} className="w-full h-64 ring-1 ring-gray-200 shadow-md">
                {post.media.type === "image" ? (
                  <img
                    src={post.media.url}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video autoPlay muted loop className="h-full object-cover">
                    <source src={post.media.url} type="video/mp4" />
                  </video>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center min-h-[50vh]">
              <p className="text-lg font-semibold text-gray-400 flex items-center gap-2">
                No Posts Found
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Explore