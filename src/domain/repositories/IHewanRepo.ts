import { APIResponse, Hewan } from "../entities/hewan";

export interface IHewanRepo{
    getAll():Promise<APIResponse<Hewan[]>>;
    getById(id:number):Promise<APIResponse<Hewan>>;
    create(hewan:Omit<Hewan,'id'>):Promise<APIResponse<Hewan>>;
    update(id:number,hewan:Omit<Hewan,'id'>):Promise<APIResponse<Hewan>>;
    delete(id:number):Promise<APIResponse<{message:string}>>;
}