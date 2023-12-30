import express from "express";
import {
  deleteImage,
  getInfoUser,
  getListCreateImage,
  getlistSavedImage,
} from "../Controllers/userController.js";
const userRoute = express.Router();
userRoute.get("/info-user", getInfoUser);
userRoute.get("/get-saved-images", getlistSavedImage);
userRoute.get("/get-add-images", getListCreateImage);
userRoute.delete("/delete-image", deleteImage);

export default userRoute;
