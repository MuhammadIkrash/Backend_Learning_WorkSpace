import { getAllStudent, getShowStudent, getAddStudent, addStudent, updateStudent, getUpdateStudent, deleteStudent } from "../Controllers/controller.js"
import express from 'express';
const router = express.Router()

router.get("/", getAllStudent)

router.get("/show-contact/:id", getShowStudent)

router.get("/add-contact", getAddStudent)
router.post("/add-contact", addStudent)

router.get("/update-contact/:id", getUpdateStudent)
router.put("/update-contact/:id", updateStudent)

router.delete("/delete-contact/:id", deleteStudent)

export default router