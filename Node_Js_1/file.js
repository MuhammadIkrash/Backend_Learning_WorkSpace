import * as fs from 'node:fs';
import os from "os"
try {
    fs.appendFileSync("./write.txt", `${new Date().getMinutes()}\n`);
    fs.appendFileSync("./write.txt", `Hey\n`);

    const res = fs.readFileSync("./write.txt", "utf-8");
    // console.log(res);

} catch (err) {
    // console.log("An error occurred:", err);
}

console.log(os.cpus().length);
