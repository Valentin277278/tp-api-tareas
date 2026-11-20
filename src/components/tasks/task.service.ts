import { isValidObjectId } from "mongoose";
import { HttpError } from "../../utils/http-error";
import { TaskFilter, TaskInput } from "./task.model";
import { taskRepository } from "./task.repository";

const PRIORITIES = ["low", "medium", "high"];

function validateId(id: string): void {
    if (!isValidObjectId(id)) {
        throw new HttpError(400, "El id no es válido");
    }
}

function pickTaskFields(data: TaskInput): TaskInput {
    const { title, priority, dueDate, completed } = data;
    return { title, priority, dueDate, completed };
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
    async getAll(ownerId: string, query: Record<string, unknown>) {
        const filter: TaskFilter = { owner: ownerId };

        if (query.completed !== undefined) {
            if (query.completed !== "true" && query.completed !== "false") {
                throw new HttpError(400, "El filtro completed debe ser true o false");
            }
            filter.completed = query.completed === "true";
        }

        if (query.priority !== undefined) {
            if (typeof query.priority !== "string" || !PRIORITIES.includes(query.priority)) {
                throw new HttpError(400, "El filtro priority debe ser low, medium o high");
            }
            filter.priority = query.priority;
        }

        return taskRepository.findAll(filter);
    },

    async getById(id: string, ownerId: string) {
        validateId(id);
        const task = await taskRepository.findOne(id, ownerId);
        if (!task) {
            throw new HttpError(404, "Tarea no encontrada");
        }
        return task;
    },

    async create(data: TaskInput, ownerId: string) {
        const fields = pickTaskFields(data);
        validateTask(fields, false);
        return taskRepository.create(fields, ownerId);
    },

    async update(id: string, ownerId: string, data: TaskInput) {
        validateId(id);
        const fields = pickTaskFields(data);
        validateTask(fields, true);
        const task = await taskRepository.update(id, ownerId, fields);
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