import express from 'express';
import session from 'express-session';
import mongoStore from "connect-mongo"
import "dotenv/config"
const app = express();
app.use(
    session({
        secret: "secret123",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 },
        store: mongoStore.create({
            mongoUrl: process.env.DB_URI
        })
    })
)
app.get('/', (req, res) => {
    if (req.session.userName) {
        res.send(`UserName From Session is : ${req.session.userName}`)
    } else {
        res.send("UserName Not Found")
    }
});

app.get('/create-session', (req, res) => {
    req.session.userName = "Muhammad Ikrash"
    res.send("UserName Session Set Success Fully")
});
app.get('/get-session', (req, res) => {
    if (req.session.userName) {
        res.send(`UserName From Session is : ${req.session.userName}`)
    } else {
        res.send("UserName Not Found")
    }
});
app.get('/delete-session', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.send(`failed to destroy Session `)
        } else {
            res.send("session destroy success ful")
        }
    })

});
app.listen(2000, () => {
    console.log('Server app listening on 2000 port!');
});
