import Notification from "../models/notification.model.js";

export const createNotification = async ({ receiverId, senderId, type, postId, message }) => {
  try {

    // Don't notify yourself
    if (receiverId.toString() === senderId.toString()) {
      return;
    }

    await Notification.create({
      receiverId,
      senderId,
      type,
      postId,
      message,
    });

  } catch (err) {
    console.log("Notification Error:", err);
  }
};