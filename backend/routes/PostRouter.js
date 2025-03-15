import express from 'express';
import { createPost, getPostsByIds } from '../controllers/PostController.js';
import { isLoggedIn } from '../middlewares/AuthMidware.js';

const router = express.Router();

router.post('/create', isLoggedIn, createPost);
router.post('/getPostsByIds', isLoggedIn, getPostsByIds);

export default router;