import express from 'express';
import { createPost, getAllPosts, getAllPostsExceptMy, getLikedPostsByIds, getPostsByIds, likeUnlikePost, getFollowingsPosts, getPostById } from '../controllers/PostController.js';
import { isLoggedIn } from '../middlewares/AuthMidware.js';

const router = express.Router();


router.post('/create', isLoggedIn, createPost); // Create a new post
router.post('/get-user-posts', isLoggedIn, getPostsByIds);  // Get posts by passing post IDs of logged in user in request body
router.post('/get-user-liked-posts', isLoggedIn, getLikedPostsByIds); // Get liked posts by passing post IDs of logged in user in request body
router.get('/get-all', isLoggedIn, getAllPosts);  //Not used yet
router.get('/get-all-except-my', isLoggedIn, getAllPostsExceptMy); // Get all posts except the logged-in user's posts
router.put('/like/:postId', isLoggedIn, likeUnlikePost);  // Like or unlike a post by passing post ID in request params
router.get('/get-followings-posts', isLoggedIn, getFollowingsPosts);
router.get('/get-post/:postId', isLoggedIn, getPostById);

export default router;