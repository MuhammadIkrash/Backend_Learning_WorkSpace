import studentSchema from "../Models/student.models.js"
// Get AllStudent 
const getAllStudent = async (req, res) => {
    const allStudent = await studentSchema.find()
    res.render('home', { allStudent });
}
// showSingleStudent
const showSingleStudent = async (req, res) => {
    const _id = req.params.id
    const showSingleStudent = await studentSchema.findOne({ _id })
    res.render('show-student', { showSingleStudent })
}
// Get Add Student Form Page
const getAddStudent = (req, res) => {
    res.render("add-student")
}
// Add Student Post Route
const addStudent = async (req, res) => {
    await studentSchema.create(req.body)
    res.redirect('/')
}
// Update Student Post Route
const updateStudent = async (req, res) => {
    const _id = req.params.id
    await studentSchema.findByIdAndUpdate(_id, req.body)
    res.redirect("/")
}
// Get Update Student Form Page 
const getUpdateStudent = async (req, res) => {
    const _id = req.params.id
    const updateSingleStudent = await studentSchema.findOne({ _id })
    res.render('update-student', { updateSingleStudent })
}
// Delete Student Route
const deleteStudent = async (req, res) => {
    const _id = req.params.id
    await studentSchema.findByIdAndDelete(_id)
    res.redirect("/");
}
// Export All Controller Function
export { getAllStudent, showSingleStudent, getAddStudent, addStudent, updateStudent, getUpdateStudent, deleteStudent }