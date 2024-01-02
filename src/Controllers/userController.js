import bcrypt from "bcrypt";
import { responseData } from "../Configs/Response.js";
import { decodeToken } from "../Configs/jwt.js";
import sequelize from "../Models/connect.js";
import initModels from "../Models/init-models.js";

import cloudinary from "cloudinary";



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

import multer from "multer";
let storage = multer.diskStorage({
  destination: "",
  filename: "",
});
import fs from "fs";
import compress_images from "compress-images";

export const createImage = async (req, res) => {
  // try {
  let { file } = req;
  // tối ưu hình ảnh , > 500KB
  compress_images(
    process.cwd() + "/public/imgs/" + file.filename,
    process.cwd() + "/public/video/",
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "10"] } },
    { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    {
      gif: {
        engine: "gifsicle",
        command: ["--colors", "64", "--use-col=web"],
      },
    },
    function (error, completed, statistic) {
      // xóa tấm hình chưa tối ưu
    }
  );
  let { token } = req.headers;
  let accessToken = decodeToken(token);
  let { nguoi_dung_id } = accessToken.data;
  let existingImage = await model.hinh_anh.findOne({
    where: {
      nguoi_dung_id: nguoi_dung_id,
    },
  });

  if (existingImage) {
    // Nếu người dùng đã có hình ảnh, cập nhật đường dẫn mới
    existingImage.duong_dan = file.filename;
    await existingImage.save();
  } else {
    // Nếu người dùng chưa có hình ảnh, tạo mới
    await model.hinh_anh.create({
      duong_dan: file.filename,
      nguoi_dung_id: nguoi_dung_id,
      is_deleted: false,
    });
  }

  res.send(file.filename);
  // } catch {
  //   responseData(res, "Lỗi ...", "", 500);
  // }
};
