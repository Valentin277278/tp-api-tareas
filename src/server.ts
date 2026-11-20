import { env } from "./config/env";
import { connectDB } from "./config/db";
import app from "./app";

async function start() {
    try {
        await connectDB();
        app.listen(env.port, () => {
            console.log(`Servidor en http://localhost:${env.port}`);
        });
    } catch (error) {
        console.log("No se pudo iniciar el servidor:", error);
        process.exit(1);
    }
}

start();