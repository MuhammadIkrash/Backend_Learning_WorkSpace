import mongoose from 'mongoose'
export const DataBaseConnection = () => {
    mongoose.connect(process.env.DB_URI)
        .then(() => {
            console.log("DataBase Connected");
        })
        .catch((error) => {
            console.log("Database Connection Error:", error);
        });
}