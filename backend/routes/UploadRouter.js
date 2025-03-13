import express from "express";
import { upload, uploadImage, uploadVideo } from "../controllers/UplaodController.js";

const router = express.Router();

// Define upload route
router.post("/profile-pic", upload.single("profile-pic"), uploadImage);
router.post("/post-image", upload.single("post-media"), uploadImage);
router.post("/post-video", upload.single("post-media"), uploadVideo);

export default router;