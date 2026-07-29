import express from 'express'
import methodOverride from "method-override";
import router from './Routers/route.js';
import { DataBaseConnection } from "./Config/database.config.js"
import "dotenv/config";
const app = express();
// Mango db Connection With Express
DataBaseConnection()

// MiddleWare
app.use(methodOverride("_method"));
app.set('view engine', "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"))

// Routes - Api
app.use("/", router)
app.listen(process.env.PORT, () => {
    console.log('Server app listening on 3000 port!');
});
