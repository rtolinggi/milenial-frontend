import { AxiosError } from "axios";
import { instance } from "./axios.api";
import { InputForm } from "../routes/pendukung/post";

export const PostPendukungApi = async (payload: InputForm) => {
    try {
        const result = await instance.post('pendukung', payload);
        const response = await result.data;
        return response;
    } catch (error) {
        const err = error as AxiosError;
        throw err.response?.data
    }
}