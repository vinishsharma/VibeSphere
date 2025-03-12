import cloudinaryV2 from "../config/cloudinary.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

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

export { upload, uploadImage };