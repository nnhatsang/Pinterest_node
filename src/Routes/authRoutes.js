import express from "express";
import { login, signUp } from "../Controllers/authController.js";
const authRoute = express.Router();
authRoute.post("/login", login);
authRoute.post("/signUp", signUp);
export default authRoute;
