import mongoose, { Types } from 'mongoose'

const studentSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Email address is required'],
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String
    }
})

const student = mongoose.model("Student", studentSchema)

export default student