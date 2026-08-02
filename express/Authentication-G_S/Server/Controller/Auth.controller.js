import userModel from "../Models/user.model.js"
import bcrypt from "bcryptjs"
const Register = async (req, res) => {
    const { userName, email, password } = req.body
    if (!userName || !email || password) {
        return res.json({
            success: false,
            message: "Missing Detailed"
        });
    }
    try {
        const existingEmail = await userModel.findOne({ email })
        if (existingEmail) {
            return res.json(
                {
                    success: false,
                    message: `User With ${email} This Email Already Exist`
                }
            )
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            userName,
            email,
            password: passwordHash
        })
        
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}