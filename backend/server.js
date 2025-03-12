import express from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors"
import RootRouter from "./routes/RootRouter.js";

const app = express();

config();
connectDB();

app.get('/api', (req, res) => {
  res.send("Server is ready");
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

//All routes
app.use('/api', RootRouter)

const PORTNO = process.env.PORT;

app.listen(PORTNO, () => {
  console.log(`✔︎ VIBE-SPHERE is serving at http://localhost:${PORTNO}\n`);
});