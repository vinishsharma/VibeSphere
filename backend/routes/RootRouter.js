import express from "express";
import AuthRouter from "./AuthRouter.js"
import UserRouter from './UserRouter.js'
import UploadRouter from './UploadRouter.js'
import PostRouter from './PostRouter.js'
import MessageRouter from './MessageRouter.js'

const router = express.Router();

//all routes
router.use('/auth', AuthRouter);
router.use('/user', UserRouter);
router.use('/upload', UploadRouter);  //Cloudinary
router.use('/post', PostRouter);
router.use('/message', MessageRouter);

export default router;
