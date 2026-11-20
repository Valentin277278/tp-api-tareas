import { Response } from "express";
import { HttpError } from "./http-error";

export function handleError(res: Response, error: unknown): void {
    if (error instanceof HttpError) {
        res.status(error.status).json({ message: error.message});
        return;
    }
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
}