import express from 'express';

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post("/properties", (req, res) => {
    res.send(req.body)
    // res.send(req.hostname)
    // res.send(req.ip)
    // res.send(req.ips)
    // res.send(req.method)
    // res.send(req.originalUrl)
    // res.send(req.path)
    // res.send(req.protocol)
    // res.send(req.secure)
    res.send(req.route)
})

app.post("/methodAccepts", (req, res) => {

    if (req.accepts("html")) {
        res.send("<h1>Hello From Html</h1>")
    }
    else if (req.accepts("jason")) {
        res.send({
            message: "Hello From Jason"
        })
    }
    else if (req.accepts("xml")) {
        res.send("<message>Hello From XML</message>")
    }
    else {
        res.send("Content Type Not Support")
    }
})
app.get('/', (req, res) => {
    res.send("d")
})
app.get("/method", (req, res) => {
    res.send(req.headers)
})

app.listen(2000, () => {
    console.log("Server Running at Port 3000");
})