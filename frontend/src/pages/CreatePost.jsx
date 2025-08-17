// import React, { useState } from "react";
// import { FaCommentDots, FaImage, FaTag, FaVideo } from "react-icons/fa";
// import axios from "axios";
// import { Loader } from "../components/Spinner.jsx";
// import { toast } from "react-toastify";
// import { useAuth } from "../context/AuthContext.jsx";

// const CreatePost = () => {
//   const [caption, setCaption] = useState("");
//   const [media, setMedia] = useState({ url: "", type: "" });
//   const [tags, setTags] = useState([]);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { user, setUser } = useAuth();

//   const handleMediaUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const fileData = new FormData();
//     fileData.append("post-media", file);

//     try {
//       setLoading(true);
//       let response;
//       let mediaType = "";

//       // Check file type to determine which API to call
//       if (file.type.startsWith("image/")) {
//         response = await axios.post("/api/upload/post-image", fileData, {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         });
//         mediaType = "image";
//       }
//       else if (file.type.startsWith("video/")) {
//         response = await axios.post("/api/upload/post-video", fileData, {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         });
//         mediaType = "video";
//       } else {
//         setError("Unsupported file format");
//         return;
//       }

//       console.log(response.data);

//       // Store both URL & type inside media object
//       if (response.data.imageURL || response.data.videoURL) {
//         setMedia({
//           url: response.data.imageURL || response.data.videoURL,
//           type: mediaType,
//         });
//       } else {
//         setError("Invalid response from server");
//       }

//     } catch (err) {
//       console.error("Error uploading media:", err);
//       setError("Failed to upload media");
//       toast.error("Error Uploading Media");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle adding tags
//   const handleTagInput = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const newTag = e.target.value.trim().replace(/\s+/g, "");
//       if (newTag && !tags.includes(newTag)) {
//         setTags([...tags, newTag]);
//       }
//       e.target.value = ""; // Clear input field after adding tag
//     }
//   };

//   // Remove a tag
//   const removeTag = (index) => {
//     setTags(tags.filter((_, i) => i !== index));
//   };

//   //API call to create post
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     if (!caption.trim()) {
//       setError("Caption is required");
//       return;
//     }

//     if (caption.length > 1000) {
//       setError("Caption cannot exceed 1000 characters");
//       return;
//     }

//     if (!media.url || !media.type) {
//       setError("Please upload an image or video");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "/api/post/create",
//         { media, caption, tags },
//         { withCredentials: true } // Ensures cookies are sent
//       );

//       setMessage(response.data.message || "Post Created Successful!");
//       console.log("Created Post:", response.data);

//       // Update AuthContext with the new post without reloading
//       setUser((prevUser) => ({
//         ...prevUser,
//         posts: [...(prevUser.posts || []), response.data.post], // Append new post
//       }));

//       // Reset form after successful post
//       setCaption("");
//       setTags([]);
//       setMedia({ url: "", type: "" });
//       toast.success(response.data.message || "Post Created Successful!");
//     } catch (error) {
//       console.error("Error creating post:", err);
//       setError(err.response?.data?.error || "Failed to create post");
//       toast.error(err.response?.data?.error || "Failed to create post");
//     }
//   };

//   return (
//     <div className="w-[70%] mx-auto py-10 min-h-[90vh] ">
//       <h2 className="text-3xl font-bold mb-6 text-center text-[#163049]">Create a Post</h2>

//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-3/4 mx-auto">
//         {/* Media Upload Section */}
//         <label className="border-2 rounded-lg border-dashed border-gray-400 p-10 w-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
//           <input
//             type="file"
//             accept="image/*,video/*"
//             onChange={handleMediaUpload}
//             className="hidden"
//           />
//           <div className="flex flex-col items-center gap-2 text-gray-500">
//             <div className="flex gap-4">
//               <FaImage className="text-3xl" />
//               <FaVideo className="text-3xl" />
//             </div>
//             <span className="text-2xl">Upload Image or Video</span>
//           </div>
//         </label>

//         {/* Preview */}
//         {media.url && (
//           <div className="mt-4 rounded-lg overflow-hidden mx-auto w-2/5">
//             {media.type === "image" ? (
//               <img
//                 src={media.url}
//                 className="w-full h-auto"
//               />
//             ) : (
//               <video controls className="w-full h-auto">
//                 <source src={media.url} type="video/mp4" />
//               </video>
//             )}
//           </div>
//         )}

//         {loading && (
//           <Loader loading={loading} className="mt-4" />
//         )}

//         {/* Caption Input */}
//         <div className="mt-4">
//           <label className="block text-[#163049] font-semibold p-2"><FaCommentDots className="inline-block" color="#163049" /> Caption</label>
//           <textarea
//             placeholder="Write a caption..."
//             value={caption}
//             onChange={(e) => setCaption(e.target.value)}
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163049]"
//             rows="3"
//           ></textarea>
//         </div>

//         {/* Tags Input */}
//         <div className="mt-4">
//           <label className="block text-[#163049] font-semibold p-2"><FaTag className="inline-block" color="#163049" /> Add Tags</label>
//           <input
//             type="text"
//             placeholder="Add tags (press Enter)"
//             onKeyDown={handleTagInput}
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163049]"
//           />
//           {/* Display Tags */}
//           <div className="flex flex-wrap gap-2 m-6 items-center">
//             {tags.map((tag, index) => (
//               <div key={index} className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full">
//                 <span>#{tag}</span>
//                 <button type="button" onClick={() => removeTag(index)} className="ml-2 text-red-400 font-bold cursor-pointer">
//                   ×
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Display Success or Failure of Create Post */}
//         {message && <p className="text-green-500 text-center mb-4">{message}</p>}
//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//         {/* Submit Button */}
//         <button type="submit" className="w-full bg-[#163049] opacity-80 text-white py-2 rounded-lg hover:opacity-100 cursor-pointer">
//           Upload
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreatePost;










import React, { useState } from "react";
import { FaCommentDots, FaImage, FaTag, FaVideo, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { Loader } from "../components/Spinner.jsx";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState({ url: "", type: "" });
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuth();

  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append("post-media", file);

    try {
      setLoading(true);
      let response;
      let mediaType = "";

      // Check file type to determine which API to call
      if (file.type.startsWith("image/")) {
        response = await axios.post("/api/upload/post-image", fileData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        mediaType = "image";
      }
      else if (file.type.startsWith("video/")) {
        response = await axios.post("/api/upload/post-video", fileData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        mediaType = "video";
      } else {
        setError("Unsupported file format");
        return;
      }

      console.log(response.data);

      // Store both URL & type inside media object
      if (response.data.imageURL || response.data.videoURL) {
        setMedia({
          url: response.data.imageURL || response.data.videoURL,
          type: mediaType,
        });
      } else {
        setError("Invalid response from server");
      }

    } catch (err) {
      console.error("Error uploading media:", err);
      setError("Failed to upload media");
      toast.error("Error Uploading Media");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding tags
  const handleTagInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = e.target.value.trim().replace(/\s+/g, "");
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      e.target.value = ""; // Clear input field after adding tag
    }
  };

  // Remove a tag
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  //API call to create post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!caption.trim()) {
      setError("Caption is required");
      return;
    }

    if (caption.length > 1000) {
      setError("Caption cannot exceed 1000 characters");
      return;
    }

    if (!media.url || !media.type) {
      setError("Please upload an image or video");
      return;
    }

    try {
      const response = await axios.post(
        "/api/post/create",
        { media, caption, tags },
        { withCredentials: true } // Ensures cookies are sent
      );

      setMessage(response.data.message || "Post Created Successful!");
      console.log("Created Post:", response.data);

      // Update AuthContext with the new post without reloading
      setUser((prevUser) => ({
        ...prevUser,
        posts: [...(prevUser.posts || []), response.data.post], // Append new post
      }));

      // Reset form after successful post
      setCaption("");
      setTags([]);
      setMedia({ url: "", type: "" });
      toast.success(response.data.message || "Post Created Successful!");
    } catch (error) {
      console.error("Error creating post:", err);
      setError(err.response?.data?.error || "Failed to create post");
      toast.error(err.response?.data?.error || "Failed to create post");
    }
  };

  return (
    // THEME CHANGE: Full-page animated gradient background
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient-x p-4 mt-8">
      <motion.div
        className="w-full max-w-2xl mx-auto"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
      >
        {/* THEME CHANGE: Gradient text for the header */}
        <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Create a New Vibe
        </h2>

        <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl shadow-purple-200/50 ring-1 ring-purple-200 space-y-6">
          {/* THEME CHANGE: Themed file upload area */}
          {!media.url && !loading && (
            <label className="border-2 rounded-2xl border-dashed border-purple-300 p-10 w-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/70 hover:border-purple-400">
              <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="hidden" />
              <div className="flex flex-col items-center gap-4 text-purple-400">
                <motion.div className="flex gap-6" whileHover={{ scale: 1.1 }}>
                  <FaImage className="text-5xl" />
                  <FaVideo className="text-5xl" />
                </motion.div>
                <span className="text-xl font-semibold">Upload Image or Video</span>
                <span className="text-sm text-slate-500">Click here to select a file</span>
              </div>
            </label>
          )}

          {loading && <Loader loading={loading} className="my-10" />}

          {media.url && (
            <div className="mt-4 rounded-xl shadow-lg overflow-hidden mx-auto w-full max-w-sm relative">
              {media.type === "image" ? <img src={media.url} className="w-full h-auto" /> : <video controls className="w-full h-auto"><source src={media.url} /></video>}
              <button type="button" onClick={() => setMedia({ url: "", type: "" })} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/80 transition-colors">
                <FaTimesCircle />
              </button>
            </div>
          )}

          {/* THEME CHANGE: Themed inputs and labels */}
          <div className="relative group">
            <label className="block text-slate-700 font-semibold mb-2"><FaCommentDots className="inline-block mr-2 text-purple-500" /> Caption</label>
            <textarea placeholder="Share your thoughts..." value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500 transition-colors duration-300" rows="3"></textarea>
          </div>

          <div className="relative group">
            <label className="block text-slate-700 font-semibold mb-2"><FaTag className="inline-block mr-2 text-purple-500" /> Tags</label>
            <input type="text" placeholder="Add tags (press Enter)" onKeyDown={handleTagInput} className="w-full p-3 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-purple-500 transition-colors duration-300" />
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag, index) => (
                // THEME CHANGE: Vibrant gradient tags
                <div key={index} className="flex items-center bg-gradient-to-r from-pink-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                  <span>#{tag}</span>
                  <button type="button" onClick={() => removeTag(index)} className="ml-2 text-white/70 font-bold cursor-pointer hover:text-white">×</button>
                </div>
              ))}
            </div>
          </div>

          {/* THEME CHANGE: Polished feedback messages */}
          {message && <p className="text-green-700 bg-green-100 border border-green-300 text-center p-3 rounded-lg flex items-center justify-center gap-2"><FaCheckCircle /> {message}</p>}
          {error && <p className="text-red-700 bg-red-100 border border-red-300 text-center p-3 rounded-lg flex items-center justify-center gap-2"><FaTimesCircle /> {error}</p>}

          <motion.button type="submit" className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-lg font-semibold shadow-lg shadow-purple-200/80"
            whileHover={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(192, 132, 252, 0.4)" }}
            whileTap={{ scale: 0.98 }}
          >
            Create Post
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePost;