import axios from "axios";


export const instance = axios.create({
    baseURL: 'http://localhost:5000/api/v1/',
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
    withCredentials: true,
})
