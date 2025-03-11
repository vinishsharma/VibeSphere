import express from "express";
import { editProfile } from "../controllers/UserController.js";
import { isLoggedIn } from "../middlewares/AuthMidware.js";

const router = express.Router();

router.put('/edit', isLoggedIn, editProfile);

export default router