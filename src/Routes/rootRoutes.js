import express from "express";
import authRoute from "./authRoutes.js";
import imageRoute from "./imageRoutes.js";
import userRoute from "./userRoutes.js";

const rootRoutes = express.Router();
rootRoutes.use("/auth", authRoute);
rootRoutes.use("/images", imageRoute);
rootRoutes.use("/user", userRoute);

export default rootRoutes;
