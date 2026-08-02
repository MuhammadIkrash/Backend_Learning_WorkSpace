import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "email is required"]
    },
    verifyOtp: {
        type: String,
        default: ""
    },
    verifyOtpExpireAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        default: ""
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0
    }
})

const userModel = mongoose.model.user || mongoose.model("User", userSchema)

export default userModel