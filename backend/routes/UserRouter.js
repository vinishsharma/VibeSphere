import express from "express";
import { deleteUser, editProfile, getAllUsers, getAllUsersExceptMe, togglePrivacy, getUserById, updatePassword } from "../controllers/UserController.js";
import { isLoggedIn } from "../middlewares/AuthMidware.js";

const router = express.Router();

router.put('/edit', isLoggedIn, editProfile);
router.get('/get-all', isLoggedIn, getAllUsers);
router.get('/get-all-except-me', isLoggedIn, getAllUsersExceptMe);
router.delete('/delete', isLoggedIn, deleteUser);
router.put('/toggle-privacy', isLoggedIn, togglePrivacy);
router.get('/profile/:userId', isLoggedIn, getUserById);
router.put('/update-password', isLoggedIn, updatePassword)

export default router