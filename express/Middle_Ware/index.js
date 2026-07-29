import express from 'express'
const app = express();
const router = express.Router()

// app.use((req, res, next) => {
//     console.log(`${new Date().getDate()} : Today Date`);
//     next()
// })
router.use((req, res, next) => {
    console.log("Router Level MiddleWare");
    next()

})
const myMiddleWare = (req, res, next) => {
    console.log("myMiddleWare");
    next()
}
app.use(myMiddleWare)
router.get("/router", (req, res) => {
    res.send("RouterMiddleWare")
})
app.use("/", router)

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use((err,req,res,next)=>{
    console.error(err);
   res.status(500).send("server error")
   next()
})
app.use((req,res)=>{
    res.send('<h1>404:Page Not Found</h1>')
})
app.listen(3000, () => {
    console.log('Example app listening on port port!');
});
