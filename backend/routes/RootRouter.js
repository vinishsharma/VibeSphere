import express from "express";
import AuthRouter from "./AuthRouter.js"

const router = express.Router();

//all routes
router.use('/auth', AuthRouter);

export default router;
