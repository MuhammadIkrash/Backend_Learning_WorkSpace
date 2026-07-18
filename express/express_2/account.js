import express from "express";
import router from "./router.js";

const app = express()
const Port = 3000
app.use("/User", router)

app.listen(Port, () => console.log(`Server is Running http://localhost:${Port}`)
)