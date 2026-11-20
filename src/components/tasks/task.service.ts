import { isValidObjectId } from "mongoose";
import { HttpError } from "../../utils/http-error";
import { TaskInput } from "./task.model";
import { taskRepository } from "./task.repository";

const PRIORITIES = ["low", "medium", "high"];

function validateId(id: string): void {
    if (!isValidObjectId(id)) {
        throw new HttpError(400, "El id no es válido");
    }
}

function validateTask(data: TaskInput, isUpdate: boolean): void {
    if (!isUpdate || data.title !== undefined) {
        if (typeof data.title !== "string" || data.title.trim().length < 3) {
            throw new HttpError(400, "El título es obligatorio y debe tener al menos 3 caracteres");
        }
    }

    if (data.priority !== undefined && !PRIORITIES.includes(data.priority)) {
        throw new HttpError(400, "La prioridad debe ser low, medium o high");
    }

    if (data.dueDate !== undefined) {
        const dueDate = new Date(data.dueDate);
        if (isNaN(dueDate.getTime())) {
            throw new HttpError(400, "La fecha límite no es una fecha válida");
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dueDate < today) {
            throw new HttpError(400, "La fecha límite no puede ser anterior a hoy");
        }
    }
}

export const taskService = {
    async getAll() {
        return taskRepository.findAll();
    },

    async getById(id: string) {
        validateId(id);
        const task = await taskRepository.findById(id);
        if (!task) {
            throw new HttpError(404, "Tarea no encontrada");
        }
        return task;
    },

    async create(data: TaskInput) {
        validateTask(data, false);
        return taskRepository.create(data);
    },

    async update(id: string, data: TaskInput) {
        validateId(id);
        validateTask(data, true);
        const task = await taskRepository.update(id, data);
        if (!task) {
            throw new HttpError(404, "Tarea no encontrada");
        }
        return task;
    },

    async remove(id: string) {
        validateId(id);
        const task = await taskRepository.remove(id);
        if (!task) {
            throw new HttpError(404, "Tarea no encontrada");
        }
        return task;
    },
};