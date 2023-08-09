import { AxiosError } from 'axios';
import { instance } from './axios.api';

export const GetStatusDukungan = async () => {
    try {
        const result = await instance.get('dukungan/status');
        const response = await result.data;
        return response;

    } catch (error) {
        const err = error as AxiosError;
        throw err.response?.data;
    }
}
