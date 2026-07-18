import { database } from "../database/database.js";

export const getUser = (req, res) => {
    res.send(database)
}