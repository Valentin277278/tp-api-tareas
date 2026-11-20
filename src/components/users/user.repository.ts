import { UserModel } from "./user.model";

export const userRepository = {
    findByEmail(email: string) {
        return UserModel.findOne({ email });
    },
    create(data: { name: string; email: string; password: string }) {
        return UserModel.create(data);
    },
};