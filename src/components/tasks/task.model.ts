import { Schema, model } from "mongoose";

export interface TaskInput {
    title?: string;
    priority?: string;
    dueDate?: string;
    completed?: boolean;
}

const taskSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        priority: { type: String, default: "medium" },
        dueDate: { type: Date },
        completed: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const TaskModel = model("Task", taskSchema);