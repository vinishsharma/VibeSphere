import React, { useState } from "react";
import { FaImage, FaVideo } from "react-icons/fa";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ caption, media, isPrivate });
    // Handle form submission (API call)
  };

  return (
    <div className="w-[70%] mx-auto py-10 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#163049]">Create a Post</h2>

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

        {/* Private Checkbox */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
            className="w-5 h-5"
          />
          <label className="text-gray-700">Make this post private</label>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full mt-6 bg-[#163049] opacity-80 text-white py-2 rounded-lg hover:opacity-100 cursor-pointer">
          Upload Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;