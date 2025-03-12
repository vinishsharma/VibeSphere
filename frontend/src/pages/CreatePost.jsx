import React, { useState } from "react";
import { FaImage, FaTag, FaVideo } from "react-icons/fa";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [tags, setTags] = useState([]);

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(URL.createObjectURL(file));
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

  //API call
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ caption, media, tags });
    // Handle form submission (API call)
  };

  return (
    <div className="w-[70%] mx-auto py-10 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#163049]">Create a Post</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-3/4 mx-auto">
        {/* Media Upload Section */}
        <label className="border-2 border-dashed border-gray-400 p-10 w-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
          <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="hidden" />
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <div className="flex gap-4">
              <FaImage className="text-3xl" />
              <FaVideo className="text-3xl" />
            </div>
            <span className="text-2xl">Upload Image or Video</span>
          </div>
        </label>

        {/* Preview */}
        {media && (
          <div className="mt-4">
            {media.includes("video") ? (
              <video src={media} controls className="w-1/3 mx-auto rounded-lg" />
            ) : (
              <img src={media} alt="Preview" className="w-1/3 object-cover mx-auto rounded-lg" />
            )}
          </div>
        )}

        {/* Caption Input */}
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full mt-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163049]"
          rows="3"
        ></textarea>

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

        {/* Submit Button */}
        <button type="submit" className="w-full bg-[#163049] opacity-80 text-white py-2 rounded-lg hover:opacity-100 cursor-pointer">
          Upload
        </button>
      </form>
    </div>
  );
};

export default CreatePost;