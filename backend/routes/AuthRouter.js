import express from "express";
import { validateLogin, validateSignup } from "../middlewares/AuthValidation.js";
import { login, logout, signup } from "../controllers/AuthController.js";
import { isLoggedIn } from "../middlewares/AuthMidware.js";

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/signup', validateSignup, signup);
router.post('/logout', logout);
router.get('/loggedInUser', isLoggedIn, async (req, res) => {
  res.json(req.user);
});

export default router