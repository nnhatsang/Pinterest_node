import initModels from "../Models/init-models.js";
import sequelize from "../Models/connect.js";
import { responseData } from "../Configs/Response.js";
import { decodeToken } from "../Configs/jwt.js";
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
//   try {
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
    await model.hinh_anh.destroy({
      where: {
        hinh_id,
      },
    });
    responseData(res, "Delete image success", "",200);
//   } catch {
//     responseData(res, "Lỗi ...", "", 500);
//   }
};
