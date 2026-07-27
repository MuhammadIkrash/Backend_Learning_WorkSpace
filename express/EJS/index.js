import express from 'express';
const app = express()
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"));
app.get('/', (req, res) => {
    const item = ["Apple", "mango", "banana", "Pineapple", "Graphs",]
    const items = [
        { id: 1, name: "Apple", color: "Red", price: 1.50 },
        { id: 2, name: "Banana", color: "Yellow", price: 0.80 },
        { id: 3, name: "Mango", color: "Orange-Yellow", price: 2.30 },
        { id: 4, name: "Orange", color: "Orange", price: 3.30 }
    ];

    res.render("home", { title: "Home Page", h1: "Welcome To Home Page!", item, items })
});
app.get("/form", (req, res) => {
    res.render("form", { message: null })
})
app.post("/submit", (req, res) => {
    const name = req.body.myName
    const message = `Hello, ${name} You SuccessFully Submit Form.`
    res.render("form", { message: message })
})
app.get('/img', (req, res) => {
    res.render("img")
});
app.listen(3000, () => {
    console.log('Server started on port');
});