import { Request, Response } from "express";
import { handleError } from "../../utils/handle-error";
import { userService } from "./user.service";

export const userController = {
    async register(req: Request, res: Response) {
        try {
            const user = await userService.register(req.body ?? {});
            res.status(201).json(user);
        } catch (error) {
            handleError(res, error);
        }
    },

    async login(req: Request, res: Response) {
        try {
            const result = await userService.login(req.body ?? {});
            res.status(200).json(result);
        } catch (error) {
            handleError(res, error);
        }
    },
};