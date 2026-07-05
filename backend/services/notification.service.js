import Notification from "../models/notification.model.js";

export const createNotification = async ({ receiverId, senderId, type, message }) => {
  try {
    // Don't notify yourself
    // if (receiverId.toString() === senderId.toString()) {
    //   return;
    // }

    // // Prevent duplicate follow notifications
    // if (type === "#follow") {
    //   const alreadyExists = await Notification.findOne({
    //     receiverId,
    //     senderId,
    //     type,
    //   });

    //   if (alreadyExists) return;
    // }

    await Notification.create({
      receiverId,
      senderId,
      type,
      message,
    });

  } catch (err) {
    console.log("Notification Error:", err);
  }
};