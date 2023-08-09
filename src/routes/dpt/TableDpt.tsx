import { LoadingOverlay, Paper, ScrollArea, createStyles } from '@mantine/core';
import type { ColumnDef } from '@tanstack/react-table';
import DataTable from '../../components/DataTable';
import React from 'react';
import { useQuery } from 'react-query';
// import { DeleteUserByID, GetUsers } from '../../api/users.api';
// import { AlertCircle, Check, UserPlus } from 'tabler-icons-react';
// import ActionButton from '../../components/ActionButton';
// import { useNavigate } from 'react-router-dom';
// import { queryClient } from '../../App';
// import { notifications } from '@mantine/notifications';
// import { ErrorMutation } from '../../api/type.api';
import { GetDpt } from '../../api/dpt.api';
// import { UserPlus } from 'tabler-icons-react';
// import ActionButton from '../../components/navbar/footer';
// import { queryClient } from '../../App';

type DataDpt = {
    id: number;
    nama: string;
    jenis_kelamin: string;
    usia: number;
    desa_kelurahan: string;
    rt: string;
    rw: string;
    tps: string;
    kode_area: string;
}

export type ResponseUsers = {
    code: number;
    data: {
        paginations: {
            currentPage: number;
            perPage: number;
            total: number;
            totalPages: number;
        }
        dpt: Array<DataDpt>
    };
    status: string;
    message: string;
    timestamp: string;
};

const dummyData = [
    {
        id: 0,
        nama: "",
        jenis_kelamin: "",
        usia: "",
        desa_kelurahan: "",
        rt: "",
        rw: "",
        tps: "",
        kode_area: "",
    },
];

export default function TableDpt() {
    const { classes } = useStyles();
    const { data: dpt, isLoading } = useQuery<ResponseUsers>(
        {
            queryKey: ['GetDpt'],
            queryFn: GetDpt,
            // refetchInterval: 5000,
        },
    );

    const dataTable = dpt
        ? dpt.data.dpt.map(item => {
            const data = {
                id: String(item.id),
                nama: item.nama,
                jenis_kelamin: item.jenis_kelamin,
                usia: String(item.usia),
                desa_kelurahan: item.desa_kelurahan,
                rt: item.rt,
                rw: item.rw,
                tps: item.tps,
                kode_area: item.kode_area,
            };
            return data;
        })
        : dummyData;

    const columns = React.useMemo<ColumnDef<typeof dataTable, string>[]>(
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
                header: 'Nama Lengkap',
                accessorKey: 'nama',
            },
            {
                header: 'Jenis Kelamin',
                accessorKey: 'jenis_kelamin',
                sortDescFirst: true,
            },
            {
                header: 'Usia',
                accessorKey: 'usia',
                sortDescFirst: true,
            },
            {
                header: 'Desa/Kelurahan',
                accessorKey: 'desa_kelurahan',
            },
            {
                header: 'RT',
                accessorKey: 'rt',
            },
            {
                header: 'RW',
                accessorKey: 'rw',
            },
            {
                header: 'TPS',
                accessorKey: 'tps',
            },
            {
                header: 'Kode Area',
                accessorKey: 'kode_area',
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    // const navigate = useNavigate();

    return (
        <>
            {/* <Paper shadow='sm' radius='md' w='100%' p={12} sx={(theme) => ({
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : undefined
            })}>
                <Button leftIcon={<UserPlus size={18} />}
                    variant='gradient'
                    onClick={() => navigate("post")}
                >
                    Import
                </Button>
            </Paper> */}
            <Paper shadow='sm' radius='md' className={classes.container}>
                <ScrollArea w={"100%"}>
                    <LoadingOverlay visible={isLoading} />
                    <DataTable
                        data={dataTable}
                        columns={columns}
                        visibility={{ id: false }}
                    />
                </ScrollArea>
            </Paper>
        </>
    );
}

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
