import { Badge, LoadingOverlay, Paper, ScrollArea, createStyles } from '@mantine/core';
import type { ColumnDef } from '@tanstack/react-table';
import DataTable from '../../components/DataTable';
import React from 'react';
import { useQuery } from 'react-query';
import { GetUsers } from '../../api/users.api';
import ActionButton from '../../components/ActionButton';
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

    console.log(users)

    //   const mutation = useMutation((val: any) => DeleteUserId(val), {
    //     onSuccess: () => {
    //       queryClient.invalidateQueries(['GetUsers']);
    //     },
    //   });

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

    const columns = React.useMemo<ColumnDef<typeof dataTable, any>[]>(
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
                id: 'Aksi',
                header: 'Aksi',
                cell: props => {
                    const row = props.row.getAllCells().map(item => item.getValue());
                    return (
                        <ActionButton
                            userId={row[1] as string}
                            userName={row[2] as string}
                        />
                    );
                },
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return (
        <>
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

const useStyles = createStyles(() => ({
    container: {
        width: '100%',
        padding: '20px',
        overflow: 'auto',
        marginTop: '1.2rem',
        position: 'relative',
    },
    loaderHeight: {
        height: '500px',
    },
}));
