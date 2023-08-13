import { Button, LoadingOverlay, Paper, ScrollArea, createStyles } from "@mantine/core";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { ListDetails, UserPlus } from "tabler-icons-react";
import { GetPendukung } from "../../api/pendukung.api";
import { useMemo } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import DataKecamatan from '../../../kecamatan.json';
import DataKelurahan from '../../../kelurahan_desa.json';
import DataTable from "../../components/DataTable";

const useStyles = createStyles((theme) => ({
    container: {
        width: '100%',
        padding: '20px',
        overflow: 'auto',
        marginTop: '1.2rem',
        position: 'relative',
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : undefined
    },
    loaderHeight: {
        height: '500px',
    },
}));

export interface ResponsePendukung {
    code: number;
    status: string;
    message: string;
    data: Data;
    timestamp: Date;
}

export interface Data {
    pendukung: Pendukung[];
}

export interface Pendukung {
    id: number;
    id_petugas: string;
    no_nik: string;
    no_kk: string;
    nama_pendukung: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: number;
    id_kota_kabupaten: string;
    id_kecamatan: string;
    id_kelurahan_desa: string;
    rt: string;
    rw: string;
    alamat_lengkap: string;
    agama: string;
    id_pekerjaan: number;
    telpon: string;
    id_status_dukungan: number;
    foto_nik: string;
    foto_selfie: string;
    valid_dpt: boolean;
    tps: string;
    keterangan: string;
    dibuat: number;
    diperbarui: number;
}



export default function TablePendukung() {
    const navigate = useNavigate()
    const { classes } = useStyles();

    const { data: pendukung, isLoading } = useQuery<ResponsePendukung>(
        {
            queryKey: ['GetPendukung'],
            queryFn: GetPendukung,
            // refetchInterval: 5000,
        },
    );
    console.log(pendukung)
    const dataDummy = [
        {
            id: 0,
            id_petugas: '',
            no_nik: '',
            no_kk: '',
            nama_pendukung: '',
            jenis_kelamin: '',
            tempat_lahir: '',
            tanggal_lahir: '',
            id_kota_kabupaten: '',
            id_kecamatan: '',
            id_kelurahan_desa: '',
            rt: '',
            rw: '',
            alamat_lengkap: '',
            agama: '',
            id_pekerjaan: 0,
            telpon: '',
            id_status_dukungan: 0,
            foto_nik: '',
            foto_selfie: '',
            valid_dpt: '',
            tps: '',
            keterangan: '',
            dibuat: 0,
            diperbarui: 0

        }
    ]
    const dataTable = pendukung?.data.pendukung ? pendukung?.data.pendukung.map((item) => {
        const kecamatan = DataKecamatan.filter((val) => val.id === item.id_kecamatan);
        const kelurahan = DataKelurahan.filter((val) => val.id === item.id_kelurahan_desa);
        return {
            ...item,
            id_kecamatan: kecamatan[0].name,
            id_kelurahan_desa: kelurahan[0].name,
        }
    }) : dataDummy;


    const columns = useMemo<ColumnDef<Pendukung, string>[]>(
        () => [
            {
                id: 'no',
                header: 'No.',
                cell: props => parseInt(props.row.id) + 1,
            },
            {
                id: 'id',
                accessorKey: 'id',
            },
            {
                header: 'ID Petugas',
                accessorKey: 'id_petugas',
            },
            {
                header: 'Nama Pendukung',
                accessorKey: 'nama_pendukung',
                sortDescFirst: true,
            },
            {
                header: 'KTP',
                accessorKey: 'no_nik',
            },
            {
                header: 'No KK',
                accessorKey: 'no_kk',
                sortDescFirst: true,
            },
            {
                header: 'Jenis Kelamin',
                accessorKey: 'jenis_kelamin',
            },
            {
                header: 'Tempat Lahir',
                accessorKey: 'tempat_lahir'
            },
            {
                header: 'Tanggal Lahir',
                accessorKey: 'tanggal_lahir'
            },
            {
                header: 'Kota/Kabupaten',
                accessorKey: 'id_kota_kabupaten'
            },
            {
                header: 'Kecamatan',
                accessorKey: 'id_kecamatan'
            },
            {
                header: 'Kelurahan/Desa',
                accessorKey: 'id_kelurahan_desa'
            },
            {
                header: 'RT',
                accessorKey: 'rt'
            },
            {
                header: 'RW',
                accessorKey: 'rw'
            },
            {
                header: 'Alamat Lengkap',
                accessorKey: 'alamat_lengkap'
            },
            {
                header: 'Agama',
                accessorKey: 'agama'
            },
            {
                header: 'Pekerjaan',
                accessorKey: 'id_pekerjaan',
            },
            {
                header: 'Telpon',
                accessorKey: 'telpon'
            },
            {
                header: 'Status Dukungan',
                accessorKey: 'id_status_dukungan',
            },
            {
                header: 'Foto KTP',
                accessorKey: 'foto_nik'
            },
            {
                header: 'Foto Lainya',
                accessorKey: 'foto_selfie'
            },
            {
                header: 'Valid DPT',
                accessorKey: 'valid_dpt',
                accessorFn: (e) => e.valid_dpt ? "Ya" : "Tidak"
            },
            {
                header: 'TPS',
                accessorKey: 'tps'
            },
            {
                header: 'Keterangan',
                accessorKey: 'keterangan'
            },
            {
                header: 'Dibuat',
                accessorKey: 'dibuat'
            },
            {
                header: 'Diperbarui',
                accessorKey: 'diperbarui'
            },


        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
    return (
        <>
            <Paper shadow='sm' radius='md' w='100%' p={12} sx={(theme) => ({
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : undefined
            })}>
                <Button leftIcon={<ListDetails size={18} />}
                    mr='sm'
                    variant='gradient'
                    onClick={() => navigate("dpt")}
                >
                    Cek DPT
                </Button>
                <Button leftIcon={<UserPlus size={18} />}
                    variant='gradient'
                    onClick={() => navigate("post")}
                >
                    Tambah Pendukung
                </Button>
            </Paper>
            <Paper shadow='sm' radius='md' className={classes.container}>
                <ScrollArea w={"100%"}>
                    <LoadingOverlay visible={isLoading} />
                    {
                        dataTable ? <DataTable
                            data={dataTable}
                            columns={columns}
                            visibility={{
                                id: false,
                                id_petugas: false,
                                no_kk: false,
                                rt: false,
                                rw: false,
                                tanggal_lahir: false,
                                id_kota_kabupaten: false,
                                alamat_lengkap: false,
                                agama: false,
                                id_pekerjaan: false,
                                foto_nik: false,
                                foto_selfie: false,
                                keterangan: false,
                                dibuat: false,
                                diperbarui: false,
                                tempat_lahir: false,
                            }}
                        /> : null
                    }

                </ScrollArea>
            </Paper>
        </>
    )
}