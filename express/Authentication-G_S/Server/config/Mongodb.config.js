import mongoose from "mongoose";
import { Env } from "./config.js";

const AuthenticationDB = async () => {
    await mongoose.connect(`${Env.MONGODB_URI}/Auth-Project`)
    console.log("DB Connected SuccessFully");

}

export default AuthenticationDB