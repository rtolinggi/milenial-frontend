import { AxiosError } from 'axios';
import { instance } from './axios.api';

export const GetDpt = async () => {
    try {
        const result = await instance.get('dpt');
        const response = await result.data;
        return response;

    } catch (error) {
        const err = error as AxiosError;
        throw err.response?.data;
    }
}

export const GetDptWihParams = async (kodeArea: string, jenisKelamin: string, nama: string) => {
    try {
        const result = await instance.get(`dpt/search/?kodeArea=${kodeArea}&jenisKelamin=${jenisKelamin}&nama=${nama}`);
        const response = await result.data;
        return response;

    } catch (error) {
        const err = error as AxiosError;
        throw err.response?.data;
    }
}