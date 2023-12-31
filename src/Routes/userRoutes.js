import express from "express";
import multer from "multer";
import {
  createImage,
  deleteImage,
  getInfoUser,
  getListCreateImage,
  getlistSavedImage,
  updateInfo,
} from "../Controllers/userController.js";

const userRoute = express.Router();

// Set up Multer for handling form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
userRoute.get("/info-user", getInfoUser);
userRoute.put("/update-info-user", updateInfo);
userRoute.get("/get-saved-images", getlistSavedImage);
userRoute.get("/get-add-images", getListCreateImage);
userRoute.put("/delete-image", deleteImage);
userRoute.post("/upload-image", upload.single("image"), createImage);


export default userRoute;
