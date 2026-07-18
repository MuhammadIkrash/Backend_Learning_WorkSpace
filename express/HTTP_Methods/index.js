import express from "express";
import router from "./Router/Routes.js";

const app = express()
const Port = 3000
export let database = []
app.use(express.json());
    
app.use("/user", router)

app.listen(Port, () => console.log(`Server Running At Port ${Port}`)
)