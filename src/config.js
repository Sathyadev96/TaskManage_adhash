import * as dotenv from "dotenv";
dotenv.config(); 

export const PORT = process.env.PORT || 3000;
export const dbUrl = process.env.MONGO_URL || "";
export const jwtSecretKey = process.env.JWT_SECRETKEY || ""; 

export default {
    PORT,
    dbUrl,

}