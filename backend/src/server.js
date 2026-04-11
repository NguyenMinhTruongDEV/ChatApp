import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRouter from "./routers/auth.route.js";
import userRouter from "./routers/user.route.js";
import friendRouter from "./routers/friend.route.js";
import messageRouter from "./routers/message.route.js";
import conversationRouter from "./routers/conversation.route.js";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/auth.middleware.js";
dotenv.config();
import { app, server } from "./socket/index.js";

// const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// public routes
app.use("/api/auth", authRouter);

// private routes
app.use(protectedRoute);
app.use("/api/users", userRouter);
app.use("/api/friends", friendRouter);
app.use("/api/messages", messageRouter);
app.use("/api/conversations", conversationRouter);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server bắt đầu trên cổng ${PORT}`);
  })
}).catch((error) => {
  console.error("Lỗi khi kết nối CSDL:", error);
});
