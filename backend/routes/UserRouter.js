import express from "express";
import { deleteUser, editProfile, getAllUsers, getAllUsersExceptMe, togglePrivacy, getUserById, updatePassword, followUnfollowUser, getFollowersByIds, getFollowingsByIds } from "../controllers/UserController.js";
import { isLoggedIn } from "../middlewares/AuthMidware.js";
import { validatePassChange } from "../middlewares/AuthValidation.js";

const router = express.Router();

router.put('/edit', isLoggedIn, editProfile);
router.get('/get-all', isLoggedIn, getAllUsers);
router.get('/get-all-except-me', isLoggedIn, getAllUsersExceptMe);
router.delete('/delete', isLoggedIn, deleteUser);
router.put('/toggle-privacy', isLoggedIn, togglePrivacy);
router.get('/profile/:userId', isLoggedIn, getUserById);
router.put('/update-password', isLoggedIn, validatePassChange, updatePassword);
router.put('/follow/:userId', isLoggedIn, followUnfollowUser);
router.post('/get-my-followers', isLoggedIn, getFollowersByIds);
router.post('/get-my-followings', isLoggedIn, getFollowingsByIds);

export default router