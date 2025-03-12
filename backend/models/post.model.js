import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User who created the post
      required: true,
    },
    caption: {
      type: String,
      maxlength: 100,
      default: "",
    },
    media: [
      {
        url: {                //Cloudinary URL
          type: String,
          required: true
        },
        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Users who liked the post
      },
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    tags: {
      type: [String],
      default: [],
    }
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);