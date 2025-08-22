import express from "express";
import { validateLogin, validateOtpVerification, validateSignup } from "../middlewares/AuthValidation.js";
import { login, logout, sendOTP, verifyOTPandSignup } from "../controllers/AuthController.js";
import { isLoggedIn } from "../middlewares/AuthMidware.js";

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/send-otp', validateSignup, sendOTP);
router.post('/verifysignup', validateOtpVerification, verifyOTPandSignup);
// router.post('/signup', validateSignup, signup);
router.post('/logout', logout);
router.get('/loggedInUser', isLoggedIn, async (req, res) => {
  res.json(req.user);
});

export default router