import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { taskController } from "./task.controller";

const router = Router();

router.get("/", taskController.getAll);
router.get("/:id", taskController.getById);
router.post("/", authMiddleware, taskController.create);
router.put("/:id", authMiddleware, taskController.update);
router.delete("/:id", authMiddleware, taskController.remove);

export default router;