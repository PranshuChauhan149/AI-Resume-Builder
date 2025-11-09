import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log("server is live...");
});

app.listen(PORT, () => {
  console.log(`server is running on this PORT : ${PORT}`);
  connectDB();
});
