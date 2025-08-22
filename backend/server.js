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
// Connect to the database
connectDB();

// Initialize socket.io with the server
initializeSocket(server);

// Basic route to check server status
app.get('/api', (req, res) => {
  res.send("Server is ready");
});

// Middlewares

// Parse JSON bodies
app.use(bodyParser.json());
// Parse URL-encoded bodies
app.use(cookieParser());
// Enable CORS for the frontend
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

//All routes
app.use('/api', RootRouter)

const PORTNO = process.env.PORT;

// Start the server
server.listen(PORTNO, () => {
  console.log(`✔︎ VIBE-SPHERE is serving at http://localhost:${PORTNO}\n`);
});