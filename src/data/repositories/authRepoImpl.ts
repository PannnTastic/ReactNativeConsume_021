import apiClient from "../api/apiClient";
import { IAuthRepository } from "../../domain/repositories/IAuthRepo";
import { LoginResponse, RegisterResponse } from "../../domain/entities/auth";

export class AuthRepoImpl implements IAuthRepository {
    async login(email: string, password: string): Promise<LoginResponse>  {
        const response = await apiClient.post<LoginResponse>("/auth/login",{email, password});
        return response.data;
    }

    async register(username:string, email:string, password:string): Promise<RegisterResponse> {
        const response = await apiClient.post<RegisterResponse>("/auth/register",{username, email, password});
        return response.data;
    }
}