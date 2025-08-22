import Message from "../models/message.model.js";

const getAllMessagesWithReceiver = async (req, res) => {
  try {
    const senderId = req.user._id; // from protectRoute middleware
    const { receiverId } = req.params;

    const conversation = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 }); // Sort by time ascending

    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error in getMessages: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getAllMessagesWithReceiver };

