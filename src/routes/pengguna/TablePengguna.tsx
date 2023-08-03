import { Badge, Button, LoadingOverlay, Paper, ScrollArea, createStyles } from '@mantine/core';
import type { ColumnDef } from '@tanstack/react-table';
import DataTable from '../../components/DataTable';
import React from 'react';
import { useMutation, useQuery } from 'react-query';
import { DeleteUserByID, GetUsers } from '../../api/users.api';
import { AlertCircle, Check, UserPlus } from 'tabler-icons-react';
import ActionButton from '../../components/ActionButton';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '../../App';
import { notifications } from '@mantine/notifications';
import { ErrorMutation } from '../../api/type.api';
// import ActionButton from '../../components/navbar/footer';
// import { queryClient } from '../../App';

type DataUsers = {
    ID: string;
    Username: string;
    Role: string;
    IsActive: boolean;
    CreatedAt: number;
    UpdatedAt: number;
}
type ResponseUsers = {
    code: number;
    data: {
        users: Array<DataUsers>
    };
    status: string;
    message: string;
    timestamp: string;
};

const dummyData = [
    {
        nama_pengguna: '',
        role: '',
        isActive: false,
        isVerified: false,
        CreatedAt: 0,
        UpdatedAt: 0,
    },
];

export default function TableUser() {
    const { classes } = useStyles();
    const { data: users, isLoading } = useQuery<ResponseUsers>(
        {
            queryKey: ['GetUsers'],
            queryFn: GetUsers,
            // refetchInterval: 5000,
        },
    );

    const mutation = useMutation({
        mutationKey: ["DeleteUserByID"],
        mutationFn: (id: any) => DeleteUserByID(id),
        onMutate: () => {
            notifications.show({
                id: 'delete-user',
                color: 'blue',
                loading: true,
                title: 'Menghapus Data Pengguna',
                autoClose: !mutation.isLoading,
                withCloseButton: false,
                message: 'proses menghapus data pengguna ke server',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['GetUsers']);
            notifications.update({
                id: 'delete-user',
                color: 'red',
                title: 'Berhasil menghapus Data',
                autoClose: 5000,
                message: 'menghapus data pengguna ke server berhasil',
                icon: <Check size="1.5rem" />,
            });
        },
        onError: (error: ErrorMutation) => {
            if (error?.code === 500) {
                notifications.update({
                    id: 'delete-user',
                    color: 'red',
                    title: 'Gagal Menghapus Data',
                    autoClose: 5000,
                    message: 'proses menghapsu data pengguna ke server gagal, internal server error',
                    icon: <AlertCircle size="1.5rem" />,
                });
            }

            if (error?.code === 404) {
                notifications.update({
                    id: 'delete-user',
                    color: 'red',
                    title: 'Gagal Menghapus Data',
                    autoClose: 5000,
                    message: 'perbarui data pengguna ke server gagal, id pengguna tidak ditemukan!',
                    icon: <AlertCircle size="1.5rem" />,
                });
            }
        }
    });

    const dataTable = users
        ? users.data.users.map(item => {
            let data = {
                id: String(item.ID),
                nama_pengguna: String(item.Username),
                peran: String(item.Role),
                aktif: item.IsActive ? 'AKTIF' : 'TIDAK AKTIF',
                dibuat: String(item.CreatedAt),
                diperbarui: String(item.UpdatedAt)
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
                header: 'Nama Pengguna',
                accessorKey: 'nama_pengguna',
            },
            {
                header: 'Peran',
                accessorKey: 'peran',
                sortDescFirst: true,
            },
            {
                header: 'Status',
                accessorKey: 'aktif',
                sortDescFirst: true,
                cell: (props) => {
                    const aktif = props.getValue() === "AKTIF";
                    return (
                        <>
                            {aktif ? <Badge variant='dot' color='green'>Aktif</Badge> : <Badge variant='dot' color='red'>Tidak Aktif</Badge>}
                        </>
                    )
                },
            },
            {
                header: 'Tgl buat',
                accessorKey: 'dibuat',
                sortDescFirst: true,
                cell: (props) => {
                    const date = new Date(Number(props.getValue())).toLocaleString(["ban", "id"]);
                    return (
                        <>{date}</>
                    )
                },
            },
            {
                id: 'Aksi',
                header: 'Aksi',
                cell: props => {
                    const row = props.row.getAllCells().map(item => item.getValue());
                    return (
                        <ActionButton
                            key={row[1] as string}
                            userId={row[1] as string}
                            userName={row[2] as string}
                            mutation={mutation}
                        />
                    );
                },
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const navigate = useNavigate();

    return (
        <>
            <Paper shadow='sm' radius='md' w='100%' p={12} sx={(theme) => ({
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : undefined
            })}>
                <Button leftIcon={<UserPlus size={18} />}
                    variant='gradient'
                    onClick={() => navigate("post")}
                >
                    Tambah Pengguna
                </Button>
            </Paper>
            <Paper shadow='sm' radius='md' className={classes.container}>
                <ScrollArea w={"100%"}>
                    <LoadingOverlay visible={isLoading || mutation.isLoading} />
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
