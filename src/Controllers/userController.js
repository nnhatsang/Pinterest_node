import bcrypt from "bcrypt";
import { responseData } from "../Configs/Response.js";
import { decodeToken } from "../Configs/jwt.js";
import sequelize from "../Models/connect.js";
import initModels from "../Models/init-models.js";

import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: "debpu6bvf",
  api_key: "917416417964682",
  api_secret: "fQU8qnEQ5kUSH1sjV64ZsA9Esk4",
});

let model = initModels(sequelize);

export const getInfoUser = async (req, res) => {
  try {
    let { token } = req.headers;
    let accessToken = decodeToken(token);
    let { nguoi_dung_id } = accessToken.data;
    let getInfo = await model.nguoi_dung.findOne({ where: { nguoi_dung_id } });
    if (!getInfo) {
      return responseData(res, "User khong ton tai", "", 404);
    }
    responseData(res, "Get info User", getInfo, 200);
  } catch {
    responseData(res, "Lỗi ...", "", 500);
  }
};

export const getlistSavedImage = async (req, res) => {
  try {
    let { token } = req.headers;
    let accessToken = decodeToken(token);
    let { nguoi_dung_id } = accessToken.data;
    const saveImage = await model.luu_anh.findAll({
      where: { nguoi_dung_id },
      include: [
        {
          model: model.hinh_anh,
          as: "hinh", // Alias cho mối quan hệ
          attributes: ["hinh_id", "ten_hinh", "duong_dan", "mo_ta"],
        },
      ],
    });
    if (!saveImage) {
      return responseData(res, "User has never saved any images", "", 404);
    }
    responseData(res, "Get list saved images by User", saveImage, 200);
  } catch {
    responseData(res, "Lỗi ...", "", 500);
  }
};

export const getListCreateImage = async (req, res) => {
  try {
    let { token } = req.headers;
    let accessToken = decodeToken(token);
    let { nguoi_dung_id } = accessToken.data;
    let getAddImg = await model.hinh_anh.findAll({ where: { nguoi_dung_id } });
    if (getAddImg.length === 0) {
      return responseData(res, "User has never create any images", "", 404);
    }
    responseData(res, "Get list create images by User", getAddImg, 200);
  } catch {
    responseData(res, "Lỗi ...", "", 500);
  }
};

export const deleteImage = async (req, res) => {
  try {
    let { token } = req.headers;
    let accessToken = decodeToken(token);
    let { nguoi_dung_id } = accessToken.data;

    let { hinh_id } = req.body;
    // check author
    const isAuthorized = await model.hinh_anh.findOne({
      where: {
        hinh_id,
        nguoi_dung_id,
      },
    });
    if (!isAuthorized)
      return responseData(
        res,
        "You don't have the right to delete this image",
        "",
        403
      );

    await model.hinh_anh.update(
      { is_deleted: true },
      {
        where: {
          hinh_id,
          is_deleted: false,
        },
      }
    );
    responseData(res, "Delete image success", "", 200);
  } catch {
    responseData(res, "Lỗi ...", "", 500);
  }
};

export const updateInfo = async (req, res) => {
  try {
    let { hoten, matkhau } = req.body;
    let { token } = req.headers;
    let accessToken = decodeToken(token);
    let { nguoi_dung_id } = accessToken.data;
    let getUser = await model.nguoi_dung.findByPk(nguoi_dung_id);
    if (!getUser) {
      return responseData(res, "User not found", "", 404);
    }
    getUser.matkhau = bcrypt.hashSync(matkhau, 10);
    getUser.hoten = hoten;
    await model.nguoi_dung.update(getUser.dataValues, {
      where: { nguoi_dung_id },
    });
    responseData(res, "Update info success", "", 200);
  } catch {
    responseData(res, "Lỗi ...", "", 500);
  }
};

export const createImage = async (req, res) => {
  //  try {
    const { token } = req.headers;
    const accessToken = decodeToken(token);
    const { nguoi_dung_id } = accessToken.data;

    const imageFile = req.file; // Assuming you are using multer middleware for file upload
    if (!imageFile) {
      return responseData(res, "Image not found in the request", "", 400);
    }

    const cloudinaryResult = await cloudinary.uploader.upload(imageFile.buffer.toString('base64'));
    
    const newImage = await model.hinh_anh.create({
      ten_hinh: req.body.ten_hinh,
      duong_dan: cloudinaryResult.secure_url,
      mo_ta: req.body.mo_ta,
      nguoi_dung_id: nguoi_dung_id,
    });

    await model.luu_anh.create({
      nguoi_dung_id: nguoi_dung_id,
      hinh_id: newImage.hinh_id,
      ngay_luu: new Date(),
    });

    responseData(res, "Create image success", newImage, 201);
  // } catch {
  //   responseData(res, "Lỗi ...", "", 500);
  // }
};
