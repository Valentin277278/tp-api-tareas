import { Request, Response } from "express";
import { handleError } from "../../utils/handle-error";
import { taskService } from "./task.service";

export const taskController = {
    async getAll(_req: Request, res: Response) {
        try {
            const tasks = await taskService.getAll();
            res.status(200).json(tasks);
        } catch (error) {
            handleError(res, error);
        }
    },

    async getById(req: Request<{ id: string }>, res: Response) {
        try {
            const task = await taskService.getById(req.params.id);
            res.status(200).json(task);
        } catch (error) {
            handleError(res, error);
        }
    },

    async create(req: Request, res: Response) {
        try {
            const task = await taskService.create(req.body ?? {});
            res.status(201).json(task);
        } catch (error) {
            handleError(res, error);
        }
    },

    async update(req: Request<{ id: string }>, res: Response) {
        try {
            const task = await taskService.update(req.params.id, req.body ?? {});
            res.status(200).json(task);
        } catch (error) {
            handleError(res, error);
        }
    },

    async remove(req: Request<{ id: string }>, res: Response) {
        try {
            await taskService.remove(req.params.id);
            res.status(200).json({ message: "Tarea eliminada" });
        } catch (error) {
            handleError(res, error);
        }
    },
};