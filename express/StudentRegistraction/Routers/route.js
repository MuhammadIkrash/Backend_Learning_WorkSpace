import { getAllStudent, showSingleStudent, getAddStudent, addStudent, updateStudent, getUpdateStudent, deleteStudent } from "../Controllers/controller.js"
import express from 'express';
import studentSchema from "../Models/student.models.js"
import { rateLimit } from "express-rate-limit"

const router = express.Router()

// Rate Limit 

const RateLimit = (time, limit, page) => {
    return rateLimit({
        windowMs: time * 60 * 1000,
        limit: limit,
        handler: async (req, res) => {
            const student = await studentSchema.findById(req.params.id);
            return res.status(429).render(page, {
                updateSingleStudent: student,
                message: "Too many requests. Please try again later.",
                retryAfter: time * 60
            });
        }
        ,
        statusCode: 429,
        standardHeaders: "draft-8"
    })
}

router.get("/", getAllStudent)

router.get("/show-contact/:id", showSingleStudent)

router.get("/add-contact", getAddStudent)
router.post("/add-contact", RateLimit(2, 2, "add-student"), addStudent)

router.get("/update-contact/:id", getUpdateStudent)
router.put("/update-contact/:id", RateLimit(2, 3, "update-student"), updateStudent)

router.delete("/delete-contact/:id", deleteStudent)

export default router