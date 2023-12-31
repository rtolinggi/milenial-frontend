export type InputSignUp = {
    username: string;
    password: string;
    role: string;
};

export type InputSignIn = {
    username: string;
    password: string;
}

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

export type ResponseSignIn = {
    auth: {
        access_token: string;
        refresh_token: string;
        created_at: number;
    }
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

export interface ResponseRelawan {
    code: number;
    status: string;
    message: string;
    data: Data;
    timestamp: Date;
}

export interface ResponseRelawanWithPagination {
    code: number;
    status: string;
    message: string;
    data: {
        petugas: Petugas[],
        paginations: {
            currentPage: number;
            perPage: number;
            total: number;
            totalPages: number;
        };
        timestamp: Date;
    }
}

export interface Data {
    petugas: Petugas[];
}

export interface Petugas {
    id: string;
    id_pengguna: string;
    no_nik: string;
    nama_lengkap: string;
    jenis_kelamin: string;
    tanggal_lahir: number;
    id_kota_kabupaten: string;
    id_kecamatan: string;
    id_kelurahan_desa: string;
    alamat_lengkap: string;
    telpon: string;
    id_jabatan: number;
    avatar: string;
    dibuat: number;
    diperbarui: number;
}

export interface Jabatan {
    ID: string;
    nama_jabatan: string;
    keterangan: string;
}

export interface Address {
    value: string;
    label: string;
}

export interface Pekerjaan {
    pekerjaan: {
        id: string;
        nama_pekerjaan: string;
        keterangan: string;
    }[]
}

export interface StatusDukungan {
    status_dukungan: {
        id: string;
        status_dukungan: string;
        keterangan: string;
    }[]
}
