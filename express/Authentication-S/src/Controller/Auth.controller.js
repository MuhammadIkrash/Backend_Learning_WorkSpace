import RegisterSchema from "../Model/UserSchema.model.js";
import crypto from "crypto"
import { JWT_SECRET } from "../config/config.js"
import Jwt from 'jsonwebtoken';
const userSignUp = async (req, res) => {
    // console.log(req.body);

    const { userName, email, password } = req.body
    const isAlreadyUser = await RegisterSchema.findOne({
        $or: [
            { userName },
            { email }
        ]
    })
    if (isAlreadyUser) {
        res.status(409).json({
            message: "Username or Email Already Used"
        });
    }

    if (!isAlreadyUser) {
        const passHash = crypto.createHash("sha256").update(password).digest("hex")
        const User = await RegisterSchema.create({
            userName, email, password: passHash
        })
        const token = Jwt.sign({
            id: userName._id
        }, JWT_SECRET, {
            expiresIn: "1h"
        })
        res.status(201).json({
            message: 'User Register SuccessFully',
            data: User,
            token: token    
        })
    }

}

export { userSignUp }