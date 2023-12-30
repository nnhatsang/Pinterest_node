import initModels from "./../Models/init-models.js";
import sequelize from "./../Models/connect.js";

let model = initModels(sequelize);
import bcrypt from "bcrypt";
import { responseData } from "../Configs/Response.js";
import { createRefToken, createToken } from "../Configs/jwt.js";

export const login = async (req, res) => {
  try {
    let { email, matkhau } = req.body;
    let checkUser = await model.nguoi_dung.findOne({
      where: {
        email,
      },
    });
    // Kiểm tra login theo các trường hợp
    if (checkUser) {
      if (bcrypt.compareSync(matkhau, checkUser.matkhau)) {
        let key = new Date().getTime();
        let token = createToken({
          nguoi_dung_id: checkUser.nguoi_dung_id,
          key,
        });
        let refToken = createRefToken({
          nguoi_dung_id: checkUser.nguoi_dung_id,
          key,
        });
        await model.nguoi_dung.update(
          { ...checkUser.dataValues, refresh_token: refToken },
          {
            where: { nguoi_dung_id: checkUser.nguoi_dung_id },
          }
        );
        responseData(res, "Login thành công", token, 200);
      } else {
        responseData(res, "Mật khẩu không đúng", "", 400);
      }
    } else {
      responseData(res, "Email không đúng", "", 400);
    }
  } catch {
    responseData(res, "Lỗi ...", "", 500);
  }
};

export const signUp = async (req, res) => {
    try {
  let { hoten, tuoi, email, matkhau } = req.body;

  let checkUser = await model.nguoi_dung.findOne({
    where: {
      email,
    },
  });
  if (checkUser) {
    responseData(res, "Email đã tồn tại", "", 400);
    return;
  }

  await model.nguoi_dung.create({
    hoten,
    email,
    matkhau: bcrypt.hashSync(matkhau, 10),
    tuoi,
    role: "user",
  });
  responseData(res, "Đăng ký thành công", "", 200);

    } catch {
      responseData(res, "Lỗi ...", "", 500);
    }
};
