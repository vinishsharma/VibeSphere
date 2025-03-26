import { z } from "zod";

// Middleware function to validate signup data
const validateSignup = (req, res, next) => {
  const signupSchema = z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must not exceed 50 characters"),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username must not exceed 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),

    email: z.string().email("Invalid email format"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password must not exceed 100 characters"),
  });

  try {
    signupSchema.parse(req.body); // Validate request body
    next();
  } catch (error) {
    res.status(400).json({ message: "Signup Validation failed", errors: error.errors });
    console.log(error.errors);
  }
};



// Middleware function to validate login data
const validateLogin = (req, res, next) => {
  const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  });

  try {
    loginSchema.parse(req.body); // Validate request body
    next();
  } catch (error) {
    res.status(400).json({ message: "Validation failed", errors: error.errors });
  }
};

const validatePassChange = (req, res, next) => {
  const passChangeSchema = z.object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password must not exceed 100 characters"),
  });

  try {
    passChangeSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: "Validation failed", errors: error.errors });
  }
}

export { validateSignup, validateLogin, validatePassChange };