import express from 'express';
import { createPost, getAllPosts, getAllPostsExceptMy, getPostsByIds } from '../controllers/PostController.js';
import { isLoggedIn } from '../middlewares/AuthMidware.js';

const router = express.Router();

router.post('/create', isLoggedIn, createPost);
router.post('/get-user-posts', isLoggedIn, getPostsByIds);
router.get('/get-all-posts', isLoggedIn, getAllPosts);
router.get('/get-all-except-my', isLoggedIn, getAllPostsExceptMy);

export default router;