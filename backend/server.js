import express from "express";
import http from "http";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors"
import RootRouter from "./routes/RootRouter.js";
import initializeSocket from "./utils/socket.js";

// Create an Express application
const app = express();
// Create HTTP server for socket.io
const server = http.createServer(app);

// Load environment variables
config();
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Initialize socket.io with the server
initializeSocket(server, allowedOrigins);

// Basic route to check server status
app.get('/api', (req, res) => {
  res.json({ status: "ok" });
});

app.get('/api/health', (req, res) => {
  res.json({ status: "ok" });
});

// Middlewares

// Parse JSON bodies
app.use(bodyParser.json());
// Parse URL-encoded bodies
app.use(cookieParser());
// Enable CORS for the frontend
app.set("trust proxy", 1);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
}));

//All routes
app.use('/api', RootRouter)

const PORTNO = process.env.PORT || 8080;

const startServer = async () => {
  await connectDB();
  server.listen(PORTNO, () => {
    console.log(`✔︎ VIBE-SPHERE is serving at http://localhost:${PORTNO}\n`);
  });
};

startServer().catch((error) => {
  console.error("Unable to start VibeSphere", error);
  process.exit(1);
});
