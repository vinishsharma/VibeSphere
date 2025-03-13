import cloudinaryV2 from "../config/cloudinary.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Image to Cloudinary
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const result = cloudinaryV2.uploader.upload_stream(
      { folder: "vibe_sphere" }, // Upload to 'profile_pictures' folder in Cloudinary
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        res.json({ imageURL: result.secure_url });
      }
    );

    result.end(req.file.buffer);
  }
  catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
}

// Upload Video to Cloudinary
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const uploadStream = cloudinaryV2.uploader.upload_stream(
      {
        folder: "vibe_sphere/videos",  // Store videos in a separate folder
        resource_type: "video",  // IMPORTANT: Specify it's a video
        chunk_size: 6000000,  // Optional: Optimize large file uploads (6MB chunks)
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        res.json({ videoURL: result.secure_url });
      }
    );

    uploadStream.end(req.file.buffer);  // Send video data to Cloudinary
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
};

export { upload, uploadImage, uploadVideo };