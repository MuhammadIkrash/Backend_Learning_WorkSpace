import { database } from "../database/database.js"

export const addUser = (req, res) => {
    const { user, email, age } = req.body
    const newUser = {
        user: user,
        email: email,
        age: age,
        id: database.length + 1
    }
    if (!email || !age || !user) {
        return res.status(400).json({
            status: "error",
            message: "Name, age, and email are required fields."
        })
    }
    database.push(newUser)
    res.status(201).json({
        message: `User ${user} created With ${email} SuccessFully`,
        status: "success",
        user: newUser
    })
}