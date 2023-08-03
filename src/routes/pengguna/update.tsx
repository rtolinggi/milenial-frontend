import { Box, Button, Divider, LoadingOverlay, Paper, Select, TextInput, Title } from "@mantine/core";
import { Form, useNavigate, useParams } from "react-router-dom";
import { DeviceFloppy, ArrowBack, Check, AlertCircle, User as IconUser } from 'tabler-icons-react';
import { useForm } from "@mantine/form";
import { useMutation } from "react-query";
import { notifications } from "@mantine/notifications";
import { UpdateUserByID, User } from "../../api/users.api";
import { ErrorMutation, InputUpdateUser, ResponseApi } from "../../api/type.api";
import { queryClient } from "../../App";

export default function PostPengguna() {
    const navigate = useNavigate();

    const { id } = useParams();
    const queryData = queryClient.getQueryState<ResponseApi<User>>("GetUsers")
    const data = queryData?.data
    const user = data?.data.users?.filter((user) => user.ID === id).map((value) => {
        return {
            id,
            username: value.Username,
            role: value.Role,
            is_active: value.IsActive
        }
    })

    const form = useForm({
        initialValues: {
            id: String(id),
            role: user && user[0].role,
            is_active: user && user[0].is_active ? "Aktif" : "Tidak Aktif",
        },
    });

    const mutation = useMutation({
        mutationFn: UpdateUserByID,
        mutationKey: ["UpdateUser"],
        onError: (error: ErrorMutation) => {
            if (error?.code === 500) {
                notifications.update({
                    id: 'update-user',
                    color: 'red',
                    title: 'Gagal perbarui Data',
                    autoClose: 5000,
                    message: 'proses perbarui data pengguna ke server gagal, internal server error',
                    icon: <AlertCircle size="1.5rem" />,
                });
            }

            if (error?.code === 404) {
                notifications.update({
                    id: 'update-user',
                    color: 'red',
                    title: 'Gagal Perbarui Data',
                    autoClose: 5000,
                    message: 'perbarui data pengguna ke server gagal, id pengguna tidak ditemukan!',
                    icon: <AlertCircle size="1.5rem" />,
                });
            }
        },

        onSuccess: async () => {
            notifications.update({
                id: 'update-user',
                color: 'green',
                title: 'Berhasil Perbarui Data',
                autoClose: 5000,
                message: 'perbarui data pengguna ke server berhasil',
                icon: <Check size="1.5rem" />,
            });
            navigate(-1);
        },
    });


    const handleSubmit = (val: InputUpdateUser) => {
        notifications.show({
            id: 'update-user',
            color: 'blue',
            loading: true,
            title: 'Perbarui Data Pengguna',
            autoClose: !mutation.isLoading,
            withCloseButton: false,
            message: 'proses perbarui data pengguna ke server',
        });
        val.is_active = val.is_active === "Aktif" ? true : false;
        // console.log(val)
        mutation.mutate(val);
    };


    return (
        <>
            <Box style={{ position: 'relative', width: '100%' }}>
                <LoadingOverlay visible={mutation.isLoading} />
                <Form onSubmit={
                    form.onSubmit((val: any) => handleSubmit(val))
                } >
                    <Paper shadow='md' radius='md' px='20px' py='20px' sx={(theme) => ({
                        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : undefined
                    })}>
                        <Title order={4}>PERBARUI PENGGUNA</Title>
                        <Divider mb='lg' mt='sm' />
                        <TextInput
                            withAsterisk
                            label='Nama Pengguna'
                            autoComplete='username'
                            icon={<IconUser size={18} />}
                            disabled
                            value={user && user[0].username}
                        />

                        <Select
                            required
                            clearable
                            description='Pilih Aktif atau Tidak'
                            label='Status'
                            placeholder='Pilih Salah Satu'
                            data={["Aktif", "Tidak Aktif"]}
                            mt='md'
                            {...form.getInputProps('is_active')}
                        />

                        <Select
                            required
                            clearable
                            description='Pilih Peran sesuai posisi Anggota'
                            label='Peran'
                            placeholder='Pilih Salah Satu'
                            data={["Admin", "Relawan", "Timsukses", "Partai"]}
                            mt='md'
                            {...form.getInputProps('role')}
                        />
                    </Paper>
                    <Paper shadow='md' radius='md' px={18} py={12} mt='lg' sx={(theme) => ({
                        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : undefined
                    })}>
                        <Button variant="gradient" type='submit' leftIcon={<DeviceFloppy size={16} />} >
                            Simpan
                        </Button>
                        <Button
                            variant="gradient"
                            onClick={() => navigate(-1)}
                            ml='md'
                            leftIcon={<ArrowBack size={16} />}>
                            Batal
                        </Button>
                    </Paper>
                </Form>
            </Box>
        </>
    )
}