import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader } from '../components/Spinner'; // Assuming you have a Spinner component
import { FaCalendarDay, FaComment } from 'react-icons/fa';
import { FcLikePlaceholder, FcLike } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { changeDateFormat } from '../utils/helper.js';
import { useNavigate } from 'react-router-dom';


const PostDisplay = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const { user, setUser } = useAuth();
  const [likes, setLikes] = useState([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); // State for lightbox
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/post/get-post/${postId}`, {
          withCredentials: true,
        });

        setPost(response.data.post);
        setLikes(response.data.post.likes);
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLikeUnlike = async () => {
    if (!post) return;
    try {
      const response = await axios.put(`/api/post/like/${post._id}`, {}, { withCredentials: true });
      setUser((prevUser) => ({ ...prevUser, likedPosts: response.data.likedPosts }));
      setLikes(response.data.likes);
    } catch (error) {
      console.error("Error liking the post", error);
    }
  };

  const handleVideoHover = (isHovering) => {
    if (videoRef.current) {
      isHovering ? videoRef.current.play() : videoRef.current.pause();
    }
  };

  const openLightbox = () => setIsLightboxOpen(true);
  const closeLightbox = () => setIsLightboxOpen(false);

  const isLiked = user && post && likes.includes(user._id);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient-x flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient-x flex items-center justify-center text-white text-lg">
        Post not found.
      </div>
    );
  }

  return (
    <>
      <div className=" mt-12 w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient-x ">
        <motion.div
          className="w-full sm:w-[90%] md:w-[70%] lg:w-[60%] mx-auto bg-white/60 backdrop-blur-lg p-6 rounded-3xl shadow-2xl shadow-purple-200/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Post Header */}
          <div
            className="flex items-center mb-4 cursor-pointer"
            onClick={() => navigate(`/profile/${post.user._id}`)} // Navigate to user profile
          >
            <img
              src={post.user.profilePicture}
              alt={post.user.name}
              className="w-10 h-10 rounded-full mr-3 object-cover ring-2 ring-purple-300 ring-offset-2 ring-offset-white/30"
            />
            <div>
              <h3 className="text-lg font-bold text-slate-800">{post.user.name}</h3>
              <p className="text-slate-500">@{post.user.username}</p>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="inline-block bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs mr-2 mb-1">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-slate-700 my-2">
            {post.caption}
          </p>

          {/* Post Media - Now with onClick to open lightbox */}
          <div
            className="w-full rounded-xl overflow-hidden bg-black/10 mb-4 cursor-pointer"
            onClick={openLightbox}
            onMouseEnter={() => post.media.type === 'video' && handleVideoHover(true)}
            onMouseLeave={() => post.media.type === 'video' && handleVideoHover(false)}
          >
            {post.media.type === "image" ? (
              <img
                src={post.media.url}
                alt="Post"
                className="w-full object-cover h-[60vh] mx-auto"
              />
            ) : (
              <video ref={videoRef} muted loop className="w-full object-cover h-[60vh]  mx-auto">
                <source src={post.media.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Post Details */}
          <div className="p-2">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={handleLikeUnlike}
                  className="cursor-pointer text-3xl"
                  whileTap={{ scale: 1.4, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                >
                  {isLiked ? <FcLike /> : <FcLikePlaceholder />}
                </motion.button>
                <div className="flex items-center gap-2 text-slate-600 text-lg font-semibold">
                  <FaComment className="text-slate-400" /> {post.comments.length}
                </div>
              </div>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                <FaCalendarDay size={12} /> {changeDateFormat(post.createdAt)}
              </p>
            </div>
            <p className={`font-bold text-md ${isLiked ? 'text-purple-600' : 'text-slate-700'}`}>
              {likes.length} {likes.length === 1 ? 'like' : 'likes'}
            </p>

            <div className='text-slate-700 mt-4 font-bold text-xl '>
              Comments
            </div>

          </div>
        </motion.div>
      </div>

      {/* --- NEW: The Lightbox Modal --- */}
      <AnimatePresence>
        {isLightboxOpen && post && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={closeLightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {post.media.type === "image" ? (
              <motion.img
                src={post.media.url}
                alt="Full screen post"
                className="max-w-[95vw] max-h-[95vh] object-contain"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the media
              />
            ) : (
              <motion.video
                src={post.media.url}
                controls
                autoPlay
                className="max-w-[95vw] max-h-[95vh] object-contain"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the media
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostDisplay;