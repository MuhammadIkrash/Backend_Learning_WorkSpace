import express from 'express'
import methodOverride from "method-override";
import router from './Routers/route.js';
import { DataBaseConnection } from "./Config/database.config.js"
const app = express();
// Mango db Connection With Express
DataBaseConnection()

// MiddleWare
app.use(methodOverride("_method"));
app.set('view engine', "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"))
app.use(express.json());
// Routes
app.use("/", router)
// Server Listen
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server app listening on 3000 ${PORT}!`);
});
