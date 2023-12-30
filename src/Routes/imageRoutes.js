import express from "express";
import {
  checkSavedImage,
  createComment,
  getImageByName,
  getImageId,
  getListCommentByImage,
  getListImage,
  saveImage,
} from "../Controllers/imageController.js";
const imageRoute = express.Router();
imageRoute.get("/get-image", getListImage);
imageRoute.get("/image-detail/:hinh_id", getImageId);
imageRoute.get("/comment-image/:hinh_id", getListCommentByImage);
imageRoute.get("/check-save-image/:hinh_id", checkSavedImage);
imageRoute.post("/save-image", saveImage);
imageRoute.post("/add-comment", createComment);

// imageRoute.get("/find-image", getImageByName);

export default imageRoute;
