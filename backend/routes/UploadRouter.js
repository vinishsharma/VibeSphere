import express from "express";
import { upload, uploadImage } from "../controllers/UplaodController.js";

const router = express.Router();

// Define upload route
router.post("/profile-pic", upload.single("profile-pic"), uploadImage);
// router.post("/post-image",upload.single("image"),uploadImage);
// router.post("/post-video",upload.single("video"),uploadImage);

export default router;