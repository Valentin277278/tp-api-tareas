import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        res.status(401).json({ message: "Token no proporcionado" });
        return;
    }

    const token = header.split(" ")[1];

    try {
        const payload = jwt.verify(token, env.jwtSecret);
        res.locals.user = payload;
        next();
    } catch {
        res.status(401).json({ message: "Token inválido o vencido" });
    }
}