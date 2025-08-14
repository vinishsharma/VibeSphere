import express from 'express';
import { createPost, getAllPosts, getAllPostsExceptMy, getLikedPostsByIds, getPostsByIds, likeUnlikePost, getFollowingsPosts } from '../controllers/PostController.js';
import { isLoggedIn } from '../middlewares/AuthMidware.js';

const router = express.Router();

router.post('/create', isLoggedIn, createPost);
router.post('/get-user-posts', isLoggedIn, getPostsByIds);
router.post('/get-user-liked-posts', isLoggedIn, getLikedPostsByIds);
router.get('/get-all', isLoggedIn, getAllPosts);
router.get('/get-all-except-my', isLoggedIn, getAllPostsExceptMy);
router.put('/like/:postId', isLoggedIn, likeUnlikePost);
router.get('/get-followings-posts', isLoggedIn, getFollowingsPosts);

export default router;