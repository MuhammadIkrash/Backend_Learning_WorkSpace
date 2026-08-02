import { MONGO_DB_URI } from "./config.js";
import mongoose from "mongoose";

const AuthDB = async () => {
    await mongoose.connect(MONGO_DB_URI)
    console.log("DataBase Connected SuccessFully")
}

export default AuthDB