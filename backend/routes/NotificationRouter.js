import express from 'express';
import { isLoggedIn } from '../middlewares/AuthMidware.js';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } from '../controllers/NotificationController.js';

const router = express.Router();

router.get('/get-all', isLoggedIn, getNotifications);
router.put('/mark-as-read/:id', isLoggedIn, markAsRead);
router.put('/mark-all-as-read', isLoggedIn, markAllAsRead);
router.delete('/delete/:id', isLoggedIn, deleteNotification);
router.delete('/delete-all', isLoggedIn, deleteAllNotifications);

export default router;