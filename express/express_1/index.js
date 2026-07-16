import express from "express"

const app = express()

app.get("/", (req, res) => {
    res.send(`Hello From Home Page`)
})

app.get("/about", (req, res) => {
    const name = req.query.myname
    const age = req.query.myAge
    res.send(`Hello From About Page ${name} and Your ${age} `)
})
const Port = 3000
app.listen(Port, () => { `App Listen at Port ${Port}` })