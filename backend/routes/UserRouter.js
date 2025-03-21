import express from "express";
import { deleteUser, editProfile, getAllUsers, getAllUsersExceptMe } from "../controllers/UserController.js";
import { isLoggedIn } from "../middlewares/AuthMidware.js";

const router = express.Router();

router.put('/edit', isLoggedIn, editProfile);
router.get('/get-all', isLoggedIn, getAllUsers);
router.get('/get-all-except-me', isLoggedIn, getAllUsersExceptMe);
router.delete('/delete', isLoggedIn, deleteUser);

export default router