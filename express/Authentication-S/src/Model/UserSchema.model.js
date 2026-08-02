import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'UserName Is required'],
        unique: [true, "userName Must Be Unique"]
    },
    email: {
        type: String,
        required: [true, 'Email Is required'],
        unique: [true, "Email Must Be Unique"]
    },
    password: {
        type: String,
        required: [true, 'Password Is required'],
    }
})

const RegisterSchema = mongoose.model("UserRegister", UserSchema)

export default RegisterSchema