import { config } from "../Configs/config.js";
import { Sequelize } from "sequelize";

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
