import express, { urlencoded } from 'express';
import "dotenv/config"
import multer from 'multer';
import path from 'path';
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set("view engine", "ejs")

const multerStorage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, "./uploads")
    },
    filename: (req, file, callBack) => {
        const fileName = Date.now() + path.extname(file.originalname)
        callBack(null, fileName)
    },
})

const fileFilter = (req, file, callBack) => {
    // if (file.mimetype.startsWith("image/")) {
    //     callBack(null, true)
    // } else {
    //     callBack(new Error("Only Images Are Allowed"), false)

    // }

    if (file.fieldname === "userFile") {
        if (file.mimetype == "video/mp4" || file.mimetype == "image/jpeg" || file.mimetype === "image/png") {
            callBack(null, true)
        } else {
            callBack(new Error("Only JPG or PNG Are Allowed"), false)

        }
    } else if (file.fieldname === "userDocuments") {
        if (file.mimetype == "application/pdf") {
            callBack(null, true)
        } else {
            callBack(new Error("Only PDF Are Allowed"), false)

        }
    } else {
        callBack(new Error("UnKnow Felid"), false)
    }
}
const multerUpload = multer({
    storage: multerStorage,
    limits: {
        fileSize: 1024 * 1024 * 3
    },
    fileFilter: fileFilter
})

app.get('/', (req, res) => {
    res.render('form', { error: null });
});
// app.post("/submitForm", multerUpload.array('userFile', 5), (req, res) => {
//     if (!req.files || req.files.length === 0) {
//         res.status(400).render("form", { error: "First Upload File" })
//         return
//     }
//     res.send(req.files)
// })
app.post("/submitForm", multerUpload.fields([
    { name: "userFile", maxCount: 1 },
    { name: "userDocuments", maxCount: 5 }
]), (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).render("form", { error: "Both File Input Require Value" })
        return
    }
    res.send(req.files)
})
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            res.render('form', { error: "Too Many Files" })
            return
        }

        return res.status(400).render("form", {
            error: error.message
        })
    } else if (error) {
        return res.status(400).render("form", {
            error: error.message
        })
    }

    next()
})
app.listen(process.env.PORT, () => {
    console.log('Server app listening on 3000 port!');
});