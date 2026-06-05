import apiClient from "../api/apiClient";
import { IHewanRepo } from "../../domain/repositories/IHewanRepo";
import { APIResponse, Hewan } from "../../domain/entities/hewan";

export class HewanRepoImpl implements IHewanRepo {
    async getAll(): Promise<APIResponse<Hewan[]>> {
        const response = await apiClient.get<APIResponse<Hewan[]>>("/hewan");
        return response.data;
    }

    async getById(id: number): Promise<APIResponse<Hewan>> {
        const response = await apiClient.get<APIResponse<Hewan>>(`/hewan/${id}`);
        return response.data;
    }

    async create(hewan: Omit<Hewan, 'id'>): Promise<APIResponse<Hewan>> {
        const response = await apiClient.post<APIResponse<Hewan>>("/hewan", hewan);
        return response.data;
    }

    async update(id: number, hewan: Omit<Hewan, 'id'>): Promise<APIResponse<Hewan>> {
        const response = await apiClient.put<APIResponse<Hewan>>(`/hewan/${id}`, hewan);
        return response.data;
    }

    async delete(id: number): Promise<APIResponse<{ message: string }>> {
        const response = await apiClient.delete<APIResponse<{ message: string }>>(`/hewan/${id}`);
        return response.data;
    }
}