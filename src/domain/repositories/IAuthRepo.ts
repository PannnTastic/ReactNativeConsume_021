import { LoginResponse, RegisterResponse } from "../entities/auth";

export interface IAuthRepository {
    login(email: string, password: string): Promise<LoginResponse>;
    register(username: string, email: string, password: string): Promise<RegisterResponse>;
}