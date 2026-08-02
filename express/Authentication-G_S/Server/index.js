import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import "dotenv/config"
import AuthenticationDB from "./config/Mongodb.config.js"
import { Env } from "./config/config.js"
const app = express()
const PORT = Env.PORT
AuthenticationDB()
app.use(express.json())
app.use(cookieParser())
app.use(cors({ credentials: true }))

app.get("/", (req, res) => {
    res.send("hello ")
})

app.listen(PORT, () => {
    console.log(`Server Is Running At http://localhost:${PORT}`);

})