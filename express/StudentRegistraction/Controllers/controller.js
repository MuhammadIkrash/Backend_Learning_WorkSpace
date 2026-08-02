import mongoose from "mongoose"
import studentSchema from "../Models/student.models.js"
import { validationResult } from "express-validator"
// Get AllStudent 
const getAllStudent = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page - 1) * limit
        const totalData = await studentSchema.countDocuments()
        const allStudent = await studentSchema.find().skip(skip).limit(limit)
        const obj = {
            page,
            limit,
            skip,
            totalData,
            totalPage: Math.ceil(totalData / limit)
        }
        return res.render('home', { allStudent, obj });
    } catch (error) {
        return res.status(500).render("500", {
            message: error.message
        });
    }
}
// showSingleStudent
const showSingleStudent = async (req, res) => {
    try {
        const _id = req.params.id
        // Checking id Valid or Not
        const isValidId = mongoose.Types.ObjectId.isValid(_id)
        if (!isValidId) {
            return res.status(404).render('404', { message: "404 Error: Page Not Found" });
        }

        const showSingleStudent = await studentSchema.findById(_id)
        // Checking id Valid or Match With Database Id
        if (!showSingleStudent) {
            return res.status(404).render('404', { message: "InValid ID: Student Not Found" });
        }
        return res.render('show-student', { showSingleStudent })
    } catch (error) {
        return res.status(500).render("500", {
            message: error.message
        });
    }
}
// Get Add Student Form Page
const getAddStudent = async (req, res) => {
    try {
        return res.render("add-student", {
            errors: [],
            oldData: {}
        })
    } catch (error) {
        return res.status(500).render("500", {
            message: error.message
        });
    }
}
// Add Student Post Route
const addStudent = async (req, res) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            res.render('add-student', {
                errors: error.array(),
                oldData: req.body
            });

        } else {
            await studentSchema.create(req.body)
            return res.redirect('/')
        }

    } catch (error) {
        return res.status(500).render("500", {
            message: error.message
        });
    }
}
// Update Student Post Route
const updateStudent = async (req, res) => {
    try {
        const _id = req.params.id
        const isValidId = mongoose.Types.ObjectId.isValid(_id)
        if (!isValidId) {
            return res.status(404).render('404', { message: "404 Error: Page Not Found" });
        }
        const student = await studentSchema.findByIdAndUpdate(_id, req.body, {
            runValidators: true
        })

        if (!student) {
            return res.status(404).render('404', { message: "InValid Id: Student Not Found" });
        }

        return res.redirect("/")
    } catch (error) {
        return res.status(500).render("500", {
            message: error.message
        });
    }
}

// Get Update Student Form Page 
const getUpdateStudent = async (req, res) => {
    try {
        const _id = req.params.id
        // Checking id Valid or Not
        const isValidId = mongoose.Types.ObjectId.isValid(_id)
        if (!isValidId) {
            return res.status(404).render('404', { message: "404 Error: Page Not Found" });

        }
        const updateSingleStudent = await studentSchema.findById(_id)
        // Check Id is Match With Database ID 
        if (!updateSingleStudent) {
            return res.status(404).render('404', { message: "InValid ID: Student Not Found" });
        }
        return res.render('update-student', { updateSingleStudent })
    } catch (error) {
        return res.status(500).render("500", {
            message: error.message
        });
    }
}
// Delete Student Route
const deleteStudent = async (req, res) => {
    try {
        const _id = req.params.id
        const isValidId = mongoose.Types.ObjectId.isValid(_id)
        if (!isValidId) {
            return res.status(404).render('404', { message: "404 Error: Page Not Found" });

        }
        const delStudent = await studentSchema.findByIdAndDelete(_id)
        if (!delStudent) {
            return res.status(404).render('404', { message: "InValid ID: Student Not Found" });
        }
        return res.redirect("/");
    } catch (error) {
        return res.status(500).render("500", {
            message: error.message
        });
    }
}
// Export All Controller Function
export { getAllStudent, showSingleStudent, getAddStudent, addStudent, updateStudent, getUpdateStudent, deleteStudent }