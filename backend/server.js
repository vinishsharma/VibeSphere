import express from "express";
import { config } from "dotenv";
config();
import connectDB from "./config/db.js";

const app = express();

connectDB();

app.get('/api', (req, res) => {
  res.send("Server is ready");
});

app.get('/api/jokes', (req, res) => {
  res.send("Jokes is running...");
});

const PORTNO = process.env.PORT;

app.listen(PORTNO, () => {
  console.log(`VibeSpere is serving at http://localhost:${PORTNO}`);
});