import express from "express";
import { getAllMessagesWithReceiver } from "../controllers/MessageController.js";

import { isLoggedIn } from "../middlewares/AuthMidware.js";

const router = express.Router();

router.get('/getChatWith/:receiverId', isLoggedIn, getAllMessagesWithReceiver);

export default router;