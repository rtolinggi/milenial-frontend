import { Avatar, Flex, Paper, Title, Box, createStyles, ScrollArea, LoadingOverlay, Divider } from "@mantine/core";
import { queryClient } from "../../App";
import { ResponseRelawanWithPagination } from "../../api/type.api";
import { useLocation, useParams } from "react-router-dom";
import { GetPendukung, GetPendukungWithRelawan } from "../../api/pendukung.api";
import { useQuery } from "react-query";
import { Pendukung, ResponsePendukung } from "../pendukung/TablePendukung";
import DataKecamatan from "../../../kecamatan.json";
import DataKelurahan from '../../../kelurahan_desa.json';
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
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

export default function DetailRelawan() {
    const { id } = useParams();
    const location = useLocation();
    const queryParams = location.state;

    const { classes } = useStyles();

    const { data: pendukung, isLoading } = useQuery<ResponsePendukung>(
        {
            queryKey: ['GetPendukungWithRelawan', id],
            queryFn: () => id ? GetPendukungWithRelawan(id) : GetPendukung(),
            // refetchInterval: 5000,
        },
    );

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
                accessorFn: (e) => e.id_status_dukungan === 0 ? "" : e.id_status_dukungan
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

    let page: any = 1;
    let row: any = 10;

    if (queryParams) {
        page = queryParams.page;
        row = queryParams.row;
    }

    const queryData = queryClient.getQueryState<ResponseRelawanWithPagination>([
        "getRelawanPagination",
        page,
        row,
    ]);

    const data = queryData?.data;
    const relawan = data?.data.petugas.filter((val) => val.id === id)

    console.log(relawan)
    return (
        <>
            <Paper shadow='sm' radius='md' w='100%' p={12} sx={(theme) => ({
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : undefined,
                marginBottom: "20px",
                padding: "20px",
                height: '160px',
            })}>
                <Flex h='140px' align='center' justify='start'>
                    <Avatar radius='md' w={170} h='100%' src={`http://localhost:5000/public/foto-relawan/${relawan && relawan[0].avatar}`} />
                    <Box w='100%' h='100%' ml={10}>
                        <Title underline order={3}>Informasi Relawan</Title>

                    </Box>
                </Flex>
            </Paper>
            <Paper shadow='sm' radius='md' className={classes.container}>
                <Title order={3}>Daftar Pendukung</Title>
                <Divider my='lg' />
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