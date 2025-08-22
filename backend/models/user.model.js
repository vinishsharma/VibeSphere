import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    phone: {
      type: Number,
      minlength: 10,
    },
    profilePicture: {
      type: String,     //Cloudinary URL
      default: "",
    },
    bio: {
      type: String,
      maxlength: 100,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    dob: {
      type: Date,
      default: new Date("2000-01-01")
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    isAccountPrivate: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: "",  // For OTP verification during signup
    },
    otpExpires: {
      type: Date,
      default: Date.now, // Default to current time, will be updated on OTP generation   
    },
  },
  { timestamps: true }
);

// --- ADD THIS INDEX ---
// This will automatically delete documents after the otpExpires time is met,
// ONLY IF the isVerified field is false.
UserSchema.index(
  { otpExpires: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { isVerified: false },
  }
);

export default mongoose.model("User", UserSchema);