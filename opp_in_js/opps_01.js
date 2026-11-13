class Opp {
    constructor() {
        console.log("constructor Method");
    }
    prototype() {
        console.log("Prototype Method");
    }
<<<<<<< HEAD
    static Static(){
=======
    static Static() {
>>>>>>> b3d89b3dcd0a84debc134bbf3fc769b5f84c0f54
        console.log("Static Method");
    }
}

let a = new Opp()
a.prototype()
Opp.Static()