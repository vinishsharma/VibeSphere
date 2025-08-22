import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User who sent the message
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User who received the message
      required: true,
    },

    text: {
      type: String,
      required: true,
      maxlength: 1000, // Limit message length to 1000 characters
      trim: true, // Remove leading and trailing whitespace
    },

  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

export default mongoose.model("Message", MessageSchema);
