import { TaskModel, TaskInput } from "./task.model";

export const taskRepository = {
    findAll() {
        return TaskModel.find();
    },
    findById(id: string) {
        return TaskModel.findById(id);
    },
    create(data: TaskInput) {
        return TaskModel.create(data);
    },
    update(id: string, data: TaskInput) {
        return TaskModel.findByIdAndUpdate(id, data, { returnDocument: "after" });
    },
    remove(id: string) {
        return TaskModel.findByIdAndDelete(id);
    },
};