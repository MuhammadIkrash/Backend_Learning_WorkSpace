import http from "http"
import * as fs from 'node:fs';
const server = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') return res.end("")
    const log = `${Date.now()} : ${req.url} New Request Rec ! \n`
    fs.appendFile("userinfo.txt", log, () => {
        console.log("New Req Rec !");
        switch (req.url) {
            case "/":
                res.end('Hello World Home!');
                break;
            case "/about":
                res.end('Hello World About !');
                break
            default:
                res.end("404 Error !")
        }
    })
})

const Port = 3000;
server.listen(Port, () => console.log("Server Started Successful 👼")
)