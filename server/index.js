import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import todoRouter from "./routes/todoRouter.js";
import cors from "cors";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use("/user", userRouter);
app.use("/todos", todoRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export { pool };