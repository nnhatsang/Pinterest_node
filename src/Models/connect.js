import { Sequelize } from "sequelize";
import { config } from "../Configs/config.js";

export const sequelize = new Sequelize(
  config.database,
  config.user,
  config.pass,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect, // tên CSDL đang sử dụng
  }
);
export default sequelize;
try {
  await sequelize.authenticate();
  console.log("Kết nối thành công");
} catch (err) {
  console.log(err);
}

// cloudinary.config({
//   cloud_name: configCloud.cloud_name,
//   api_key: configCloud.api_key,
//   api_secret: config.api_secret,
// });

