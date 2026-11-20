import { TaskModel, TaskInput, TaskFilter } from "./task.model";

export const taskRepository = {
    findAll(filter: TaskFilter) {
        return TaskModel.find(filter);
    },
    findOne(id: string, ownerId: string) {
        return TaskModel.findOne({ _id: id, owner: ownerId });
    },
    create(data: TaskInput, ownerId: string) {
        return TaskModel.create({ ...data, owner: ownerId });
    },
    update(id: string, ownerId: string, data: TaskInput) {
        return TaskModel.findOneAndUpdate({ _id: id, owner: ownerId }, data, {
            returnDocument: "after",
        });
    },
    remove(id: string) {
        return TaskModel.findByIdAndDelete(id);
    },
};