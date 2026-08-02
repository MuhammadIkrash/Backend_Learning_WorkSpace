if (!process.env.MONGODB_URI) {
    throw new Error("MONGO_DB_URI is not define in environment variable")
}
else if (!process.env.PORT) {
    throw new Error("PORT is not define in environment variable")
}
else if (!process.env.JWT_SECRET) {
    throw new Error("PORT is not define in environment variable")
}
const Env = {
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
}

export { Env }