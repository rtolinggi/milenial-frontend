import { AxiosError } from 'axios';
import { instance } from './axios.api';
import { InputForm } from '../routes/relawan/post';

export const GetRelawan = async () => {
    try {
        const result = await instance.get('petugas');
        const response = await result.data;
        return response

    } catch (error) {
        const err = error as AxiosError;
        throw err.response?.data
    }
}

export const GetRelawanPagination = async (page: number, perPage: number) => {
    try {
        const result = await instance.get(`petugas/pagination?page=${page}&perPage=${perPage}`);
        const response = await result.data;
        return response;
    }
    catch (error) {
        const err = error as AxiosError;
        throw err.response?.data;
    }
}


export const PostRelawanApi = async (payload: InputForm) => {
    try {
        const result = await instance.post('petugas', payload);
        const response = await result.data;
        return response;
    } catch (error) {
        const err = error as AxiosError;
        throw err.response?.data
    }
}

export const UploadImageRelawan = async (id: string, payload: any) => {
    try {
        const result = await instance.post(`petugas/${id}/upload`, payload)
        const response = await result.data;
        return response
    } catch (error) {
        const err = error as AxiosError;
        throw err.response?.data;
    }
}