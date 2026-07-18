import express from "express";
import { database } from "../database/database.js";
import  {updateUser}  from "../controller/UpdateUser.js";
import  {addUser}  from "../controller/addUser.js";
import {getUser}  from "../controller/getUser.js";

const router = express.Router()

router.get("/", getUser)
router.post("/", addUser)
router.put("/:id", updateUser)

export default router