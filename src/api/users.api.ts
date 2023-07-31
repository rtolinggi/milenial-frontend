import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:5000/api/v1/',
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const GetUsers = async () => {
    const result = await instance.get('users');
    const response = result.data;
    return response;
}