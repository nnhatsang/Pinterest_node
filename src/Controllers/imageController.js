import initModels from "../Models/init-models.js";
import sequelize from "../Models/connect.js";
import { responseData } from "../Configs/Response.js";
import { decodeToken } from "../Configs/jwt.js";
import { Op } from "sequelize";
let model = initModels(sequelize);

export const getListImage = async (req, res) => {
  try {
    const { key } = req.query;
    if (key) {
      // Nếu có key, thực hiện tìm kiếm
      let data = await model.hinh_anh.findAll({
        where: {
          ten_hinh: {
            [Op.like]: `%${key}%`,
          },
          is_deleted: false,
        },
      });

      if (!data || data.length === 0) {
        responseData(res, "Không tìm thấy hình với tên đã cho", "", 404);
        return;
      }
      responseData(res, data, "Thành công", 200);
    } else {
      // Nếu không có key, trả về tất cả hình ảnh
      let data = await model.hinh_anh.findAll({ where: { is_deleted: false } });
      responseData(res, "Thành công", data, 200);
    }
  } catch {
    responseData(res, "Lỗi ...", "", 500);
  }
};

// export const getImageByName = async (req, res) => {
//   try {
//     //   const { ten_hinh } = req.params;
//     const { key } = req.query;
//     if (!key) {
//       responseData(res, "Tên hình không được trống", "", 400);
//       return;
//     }

//     let data = await model.hinh_anh.findAll({
//       where: {
//         ten_hinh: {
//           [Op.like]: `%${key}%`,
//         },
//       },
//     });

//     if (!data || data.length === 0) {
//       // Nếu không tìm thấy hình, trả về mã lỗi 404 - Not Found
//       responseData(res, "Không tìm thấy hình với tên đã cho", "", 404);
//       return;
//     }

//     responseData(res, "Thành công", data, 200);
//   } catch {
//     responseData(res, "Lỗi ...", "", 500);
//   }
// };

export const getImageId = async (req, res) => {
  try {
    let { hinh_id } = req.params;
    let data = await model.hinh_anh.findOne({
      where: { hinh_id, is_deleted: false },
      include: [
        {
          model: model.nguoi_dung,
          as: "nguoi_dung", // Alias cho mối quan hệ
          attributes: ["nguoi_dung_id", "email", "hoten", "anh_dai_dien"],
        },
      ],
    });
    if (!data || data.length === 0)
      return responseData(res, "Không tìm thấy hình với tên đã cho", "", 404);

    responseData(res, "Thành công", data, 200);
  } catch {
    responseData(res, "Lỗi ...", "", 500);
  }
};

export const getListCommentByImage = async (req, res) => {
  try {
    let { hinh_id } = req.params;
    let data = await model.binh_luan.findAll({
      where: {
        hinh_id,
      },
      include: [
        {
          model: model.nguoi_dung,
          as: "nguoi_dung",
          attributes: ["nguoi_dung_id", "email", "hoten", "anh_dai_dien"],
        },
      ],
    });
    responseData(res, "Thành công", data, 200);
  } catch {
    responseData(res, "Lỗi ...", "", 500);
  }
};

export const checkSavedImage = async (req, res) => {
  try {
    let { token } = req.headers;
    let dToken = decodeToken(token);
    let { nguoi_dung_id } = dToken.data;
    const { hinh_id } = req.params;

    const existingSave = await model.luu_anh.findOne({
      where: {
        nguoi_dung_id,
        hinh_id,
      },
    });
    if (existingSave) {
      responseData(res, true, "Da luu anh nay", 200);
    } else {
      responseData(res, false, "Chua luu", 200);
    }
  } catch {
    responseData(res, "Lỗi ...", "", 500);
  }
};
export const saveImage = async (req, res) => {
  try {
    let { token } = req.headers;
    let dToken = decodeToken(token);
    let { nguoi_dung_id } = dToken.data;
    let { hinh_id } = req.body;
    const checkExistingSave = await model.luu_anh.findOne({
      where: {
        nguoi_dung_id,
        hinh_id,
      },
    });
    if (checkExistingSave) {
      return responseData(res, "ĐÃ LƯU TRƯỚC ĐÓ", "", 400);
    }

    await model.luu_anh.create({
      nguoi_dung_id,
      hinh_id,
      ngay_luu: new Date(),
    });

    responseData(res, "Thành công", "", 200);
  } catch {
    responseData(res, "Lỗi ...", "", 500);
  }
};

export const createComment = async (req, res) => {
  try {
    let { token } = req.headers;
    let dToken = decodeToken(token);
    let { nguoi_dung_id } = dToken.data;
    let { hinh_id, noi_dung } = req.body;

    await model.binh_luan.create({
      nguoi_dung_id,
      hinh_id,
      noi_dung,
      ngay_binh_luan: new Date(),
      timestamp: new Date(),
    });
    let data = await model.binh_luan.findAll({
      where: { hinh_id },
      include: [
        {
          model: model.nguoi_dung,
          as: "nguoi_dung",
          attributes: ["nguoi_dung_id", "email", "hoten", "anh_dai_dien"],
        },
      ],
    });
    responseData(res, "Thành công them binh luan", data, 200);
  } catch {
    responseData(res, "Lỗi ...", "", 500);
  }
};
