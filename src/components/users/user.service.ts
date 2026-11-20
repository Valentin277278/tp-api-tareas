import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { HttpError } from "../../utils/http-error";
import { UserInput } from "./user.model";
import { userRepository } from "./user.repository";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const userService = {
    async register(data: UserInput) {
        const name = data.name?.trim();
        const email = data.email?.trim().toLowerCase();
        const password = data.password;

        if (!name || !email || !password) {
            throw new HttpError(400, "Nombre, email y contraseña son obligatorios");
        }
        if (!EMAIL_REGEX.test(email)) {
            throw new HttpError(400, "El email no es válido");
        }
        if (password.length < 6) {
            throw new HttpError(400, "La contraseña debe tener al menos 6 caracteres");
        }

        const existing = await userRepository.findByEmail(email);
        if (existing) {
            throw new HttpError(400, "Ya existe un usuario con ese email");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userRepository.create({ name, email, password: hashedPassword });

        return { id: user.id, name: user.name, email: user.email, role: user.role };
    },

    async login(data: UserInput) {
        const email = data.email?.trim().toLowerCase();
        const password = data.password;

        if (!email || !password) {
            throw new HttpError(400, "Email y contraseña son obligatorios");
        }

        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new HttpError(401, "Credenciales inválidas");
        }

        const passwordOk = await bcrypt.compare(password, user.password);
        if (!passwordOk) {
            throw new HttpError(401, "Credenciales inválidas");
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            env.jwtSecret,
            { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] }
        );

        return { token };
    },
};