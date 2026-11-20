import express from "express";
import taskRoutes from "./components/tasks/task.routes";
import userRoutes from "./components/users/user.routes";
import { loggerMiddleware } from "./middlewares/logger.middleware";

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/auth", userRoutes);
app.use("/api/tasks", taskRoutes);

app.use((_req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});

export default app;