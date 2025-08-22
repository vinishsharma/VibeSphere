import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";



const sendOTP = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Check if user already exists
    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });
    if (emailExists || usernameExists) {
      return res.status(409).json({ message: "Email or Username already registered" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);

    // Hash password and OTP for secure storage
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    // Create a new unverified user or update an existing one
    await User.findOneAndUpdate(
      { email },
      {
        name,
        username,
        password: hashedPassword,
        otp: hashedOtp,
        otpExpires,
        isVerified: false,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send the OTP to the user's email
    await sendEmail({
      email: email,
      subject: "VibeSphere - Email Verification",
      message: `Hello ${name},\n\nYour One-Time Password (OTP) is: ${otp}\n\nThis code is valid for 5 minutes.\n`,
    });

    res.status(200).json({ message: "OTP sent successfully to your email." });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "This username is already pending verification by another user." });
    }
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const verifyOTPandSignup = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the unverified user by email
    const user = await User.findOne({ email, isVerified: false });

    if (!user) {
      return res.status(400).json({ message: "No pending registration found for this email. Please try again." });
    }

    // Check if the OTP is expired
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Compare the provided OTP with the stored hashed OTP
    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP provided." });
    }

    // Finalize the user account
    user.isVerified = true;
    user.otp = undefined; // Clear OTP fields for security
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    // Set HTTP-Only Cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      // sameSite: 'strict',
    });

    // Ensure the password and other sensitive fields are not sent back
    user.password = undefined;

    res.status(201).json({ message: "Signup successful!", token, user });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//Logout Controller
const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export { sendOTP, verifyOTPandSignup, login, logout };