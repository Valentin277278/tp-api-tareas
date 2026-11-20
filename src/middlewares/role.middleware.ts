import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "./auth.middleware";

export function requireRole(role: string) {
    return (_req: Request, res: Response, next: NextFunction): void => {
        const user = res.locals.user as AuthPayload | undefined;

        if (!user || user.role !== role) {
            res.status(403).json({ message: "No tenés permisos para realizar esta acción" });
            return;
        }

        next();
    };
}