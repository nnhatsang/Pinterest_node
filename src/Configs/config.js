import dotenv from "dotenv";
dotenv.config();

export const config = {
  database: process.env.DB_DATABSE,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
};

// export const configCloud = {
//   cloud_name: process.dotenv.cloud_name,
//   api_key: process.dotenv.api_key,
//   api_secret: process.dotenv.api_secret,
// };
