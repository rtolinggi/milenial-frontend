import { instance } from './axios.api';
import { AxiosError } from 'axios'
import type { InputUpdateUser } from './type.api';


export const GetUsers = async () => {
    try {
        const result = await instance.get('users');
        const response = result.data;
        return response;
    } catch (error) {
        const err = error as AxiosError;
        throw err.response?.data;
    }
}

export const GetUsersWithRelawan = async () => {
    try {
        const result = await instance.get('users/petugas');
        const response = await result.data;
        return response;
    } catch (error) {
        const err = error as AxiosError;
        throw err.response?.data;
    }
}

export const GetUsersByid = async (id: string) => {
    try {
        const result = await instance.get(`users/${id}`);
        const response = await result.data;
        return response
    } catch (error) {
        const err = error as AxiosError;
        throw err.response?.data;
    }
}

export const UpdateUserByID = async (payload: InputUpdateUser) => {
    try {
        const url = `users/${payload.id}`;
        const result = await instance.put(url, payload);
        const response = await result.data;
        return response
    } catch (error) {
        const err = error as AxiosError;
        throw err.response?.data;
    }
}

export const DeleteUserByID = async (id: string) => {
    try {
        const url = `users/${id}`;
        const result = await instance.delete(url)
        const response = await result.data
        return response
    } catch (error) {
        const err = error as AxiosError
        throw err.response?.data
    }
}

export interface User {
    users?: {
        ID: string;
        Username: string;
        Role: string;
        IsActive: boolean;
        CreatedAt: number;
        UpdatedAt: number;
    }[];
}