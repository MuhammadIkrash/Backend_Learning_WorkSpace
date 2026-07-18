import express from "express"
import { home, paramsValue, queryValue } from "./controller.js"

const app = express()
const Port = 3000
app.get("/", home)
app.get("/user/:username", paramsValue)
app.get("/search", queryValue)

app.listen(Port, () => console.log(`Server is Running At http://localhost:${Port}`))

