import { Request, Response } from "express";
import { AuthPayload } from "../../middlewares/auth.middleware";
import { handleError } from "../../utils/handle-error";
import { taskService } from "./task.service";

export const taskController = {
    async getAll(req: Request, res: Response) {
        try {
            const user = res.locals.user as AuthPayload;
            const tasks = await taskService.getAll(user.id, req.query);
            res.status(200).json(tasks);
        } catch (error) {
            handleError(res, error);
        }
    },

    async getById(req: Request<{ id: string }>, res: Response) {
        try {
            const user = res.locals.user as AuthPayload;
            const task = await taskService.getById(req.params.id, user.id);
            res.status(200).json(task);
        } catch (error) {
            handleError(res, error);
        }
    },

    async create(req: Request, res: Response) {
        try {
            const user = res.locals.user as AuthPayload;
            const task = await taskService.create(req.body ?? {}, user.id);
            res.status(201).json(task);
        } catch (error) {
            handleError(res, error);
        }
    },

    async update(req: Request<{ id: string }>, res: Response) {
        try {
            const user = res.locals.user as AuthPayload;
            const task = await taskService.update(req.params.id, user.id, req.body ?? {});
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