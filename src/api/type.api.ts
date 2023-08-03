export type InputSignUp = {
    username: string;
    password: string;
    role: string;
};

export type ErrorMutation = {
    code: number;
    data: null;
    message: string;
    status: string;
};

export type ResponseApi<T> = {
    code: number;
    data: T;
    message: string;
    status: string;
    timestamp: string;
}

export type InputUpdateUser = {
    id: string;
    role: string;
    is_active: boolean | string;
}

export type Paginations = {
    currentPage: number,
    perPage: number,
    total: number,
    totalPages: number,
} | undefined;