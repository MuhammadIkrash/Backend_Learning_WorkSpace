import dotenv from "dotenv";
dotenv.config()

if (!process.env.MONGO_DB_URI) {
    throw new Error("MONGO_DB_URI is not defined in environment variables");
}
else if (!process.env.PORT) {
    throw new Error("PORT is not defined in environment variables");

}
else if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");

}


const PORT = process.env.Port
const MONGO_DB_URI = process.env.MONGO_DB_URI
const JWT_SECRET = process.env.JWT_SECRET

export { PORT, MONGO_DB_URI, JWT_SECRET }