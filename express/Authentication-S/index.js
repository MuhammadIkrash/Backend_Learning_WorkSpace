import express from 'express'
import { PORT } from './src/config/config.js';
import AuthDB from './src/config/database.model.js';
import AuthRoutes from './src/Routes/auth.route.js';
const app = express();
app.use(express.json())

AuthDB()
app.use("/auth/api", AuthRoutes)

app.listen(PORT, () => {
    console.log('Server app listening on port 3000!');
});