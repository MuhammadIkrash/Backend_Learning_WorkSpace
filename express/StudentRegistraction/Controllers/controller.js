import studentSchema from "../Models/student.models.js"
const getAllStudent = async (req, res) => {
    const allStudent = await studentSchema.find()
    res.render('home', { allStudent });
}

const getShowStudent = async (req, res) => {
    const _id = req.params.id
    const showSingleStudent = await studentSchema.findOne({ _id })
    res.render('show-student', { showSingleStudent })
}
const getAddStudent = (req, res) => {
    res.render("add-student")
}
const addStudent = async (req, res) => {
    await studentSchema.create(req.body)
    res.redirect('/')
}

const updateStudent = async (req, res) => {
    const _id = req.params.id
    await studentSchema.findByIdAndUpdate(_id, req.body)
    res.redirect("/")
}

const getUpdateStudent = async (req, res) => {
    const _id = req.params.id
    const updateSingleStudent = await studentSchema.findOne({ _id })
    res.render('update-student', { updateSingleStudent })
}

const deleteStudent = async (req, res) => {
    const _id = req.params.id
    await studentSchema.findByIdAndDelete(_id)
    res.redirect("/");
}

export { getAllStudent, getShowStudent, getAddStudent, addStudent, updateStudent, getUpdateStudent, deleteStudent }