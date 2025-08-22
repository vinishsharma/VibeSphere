import { Server } from "socket.io";
import Message from '../models/message.model.js' // Adjust the import path as necessary

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Make sure this matches your client's origin
      methods: ["GET", "POST"],
    },
  });

  let userSocketMap = {}; // { userId: socketId }

  const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
  };

  io.on("connection", (socket) => {
    // console.log("🔌 A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    // Send the list of online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Listen for a new message
    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      try {
        const newMessage = new Message({
          senderId,
          receiverId,
          text,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }
      } catch (error) {
        console.error("Error handling message:", error);
      }
    });

    socket.on("disconnect", () => {
      // console.log("User disconnected:", socket.id);
      for (let id in userSocketMap) {
        if (userSocketMap[id] === socket.id) {
          delete userSocketMap[id];
          break;
        }
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

export default initializeSocket;