import express from 'express';
const app = express();
app.set("view engine", "ejs")

app.get("/send", (req, res) => {
    // res.send("Hello From Home") // Response.send in text
    // res.send("<a href='http://google.com/'>Google</a>") // Response.send in html
    // res.send({name: "Ali"}) // Response.send in object
    // res.send(["Hello From Home",12]) // Response.send in Array
})
app.get("/jason", (req, res) => {
    res.json(
        {
            name: "Muhammad Ikrash",
            age: 16,
            class: 11
        }
    )
})
app.get("/redirect", (req, res) => {
    // res.redirect("/jason")
    // res.redirect("http://google.com/")
    res.redirect("..")
})

app.get("/about", (req, res) => {
    res.render("user")
})
app.get("/download", (req, res) => {
    res.download("./video/video.mp4", "shortVideo.mp4")
})
// app.get("/pdf", (req,res)=>{
//     res.download(__dirname + "/video/video.mp4")
// })

app.get('/check', (req, res) => {
    console.log(res.headersSent)
    res.send("hello")
    console.log(res.headersSent)
})
app.get('/getSet',(req,res)=>{
    res.set('custom' , "1234")
    res.send(res.get("custom"))
})

app.listen(3000, () => {
    console.log("Server is Run SuccessFull");

})