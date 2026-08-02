import { userSignUp } from "../Controller/Auth.controller.js";
import { Router } from "express";
const AuthRoutes = Router()
AuthRoutes.post("/", userSignUp)
export default AuthRoutes