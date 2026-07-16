import express from "express"
const Api = express()

let dataBase = []
Api.use(express.json());
Api.get("/Employ", (req, res) => {
    return res.json(dataBase)
})

Api.get("/Employ/:id", (req, res) => {
    const id = Number(req.params.id)
    const user = dataBase.find((user) => user.id === id)
    if (!user) return res.status(404).json({ message: "Employee not found" });
    return res.json(user);
    return res.json(user)
})
Api.post("/Employ", (req, res) => {
    const newEmploy = {
        id: dataBase.length + 1,
        ...req.body

    }
    dataBase.push(newEmploy)
    return res.status(201).json(newEmploy);
})

const Port = 3000
Api.listen(Port, () => console.log(`Server Running At Port ${Port}`))