import { Schema, model } from "mongoose";

export interface TaskInput {
    title?: string;
    priority?: string;
    dueDate?: string;
    completed?: boolean;
}

export interface TaskFilter {
    owner: string;
    completed?: boolean;
    priority?: string;
}

const taskSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        priority: { type: String, default: "medium" },
        dueDate: { type: Date },
        completed: { type: Boolean, default: false },
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const TaskModel = model("Task", taskSchema);