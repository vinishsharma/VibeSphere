import express from "express";
import AuthRouter from "./AuthRouter.js"
import UserRouter from './UserRouter.js'
import UploadRouter from './UploadRouter.js'

const router = express.Router();

//all routes
router.use('/auth', AuthRouter);
router.use('/user', UserRouter);
router.use('/upload', UploadRouter);

export default router;
