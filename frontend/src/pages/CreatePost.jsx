import React, { useState } from "react";
import { FaCommentDots, FaImage, FaTag, FaVideo } from "react-icons/fa";
import axios from "axios";
import { Loader } from "../components/Spinner.jsx";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";

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
    <div className="w-[70%] mx-auto py-10 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#163049]">Create a Post</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-3/4 mx-auto">
        {/* Media Upload Section */}
        <label className="border-2 rounded-lg border-dashed border-gray-400 p-10 w-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaUpload}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <div className="flex gap-4">
              <FaImage className="text-3xl" />
              <FaVideo className="text-3xl" />
            </div>
            <span className="text-2xl">Upload Image or Video</span>
          </div>
        </label>

        {/* Preview */}
        {media.url && (
          <div className="mt-4 rounded-lg overflow-hidden mx-auto w-2/5">
            {media.type === "image" ? (
              <img
                src={media.url}
                className="w-full h-auto"
              />
            ) : (
              <video controls className="w-full h-auto">
                <source src={media.url} type="video/mp4" />
              </video>
            )}
          </div>
        )}

        {loading && (
          <Loader loading={loading} className="mt-4" />
        )}

        {/* Caption Input */}
        <div className="mt-4">
          <label className="block text-[#163049] font-semibold p-2"><FaCommentDots className="inline-block" color="#163049" /> Caption</label>
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163049]"
            rows="3"
          ></textarea>
        </div>

        {/* Tags Input */}
        <div className="mt-4">
          <label className="block text-[#163049] font-semibold p-2"><FaTag className="inline-block" color="#163049" /> Add Tags</label>
          <input
            type="text"
            placeholder="Add tags (press Enter)"
            onKeyDown={handleTagInput}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163049]"
          />
          {/* Display Tags */}
          <div className="flex flex-wrap gap-2 m-6 items-center">
            {tags.map((tag, index) => (
              <div key={index} className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full">
                <span>#{tag}</span>
                <button type="button" onClick={() => removeTag(index)} className="ml-2 text-red-400 font-bold cursor-pointer">
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Display Success or Failure of Create Post */}
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Submit Button */}
        <button type="submit" className="w-full bg-[#163049] opacity-80 text-white py-2 rounded-lg hover:opacity-100 cursor-pointer">
          Upload
        </button>
      </form>
    </div>
  );
};

export default CreatePost;