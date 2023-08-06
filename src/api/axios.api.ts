import axios from "axios";


export const instance = axios.create({
    baseURL: 'http://localhost:5000/api/v1/',
    timeout: 10000,
})

instance.defaults.headers.common['Content-Type'] = 'application/json';