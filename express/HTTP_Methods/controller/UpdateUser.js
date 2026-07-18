import { database } from "../database/database.js"
export const updateUser = (req, res) => {
    const userId = Number(req.params.id)
    const findUser = database.findIndex((u) => u.id === userId)
    if (findUser === -1) {
        return res.status(404).json({
            message: `404 Error ! Employ Cannot Found With This ${userId} ID`,
            status: "error"
        })
    }
    const { user, email, age } = req.body
    if (!user || !email || !age) {
       return res.status(400).json({
            message: `Missing Require Fields : user ,email ,age Cannot Be Blank `
        })
    }

    database[findUser] = {
        id: userId,
        user: user,
        email: email,
        age: age
    }
    res.status(200).json({
        message: `User ${user} With ${email} SuccessFully Update`,
        status: "success",
        user: database[findUser]
    })
}