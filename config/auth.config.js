import dotenv from "dotenv";
dotenv.config(); 

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not found in .env!");
}

export default {
  secret: process.env.JWT_SECRET
};