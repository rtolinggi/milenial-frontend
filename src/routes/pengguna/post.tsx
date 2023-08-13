import { Box, Button, Divider, LoadingOverlay, Paper, PasswordInput, Select, TextInput, Title } from "@mantine/core";
import { Form, useNavigate } from "react-router-dom";
import * as z from 'zod';
import { User, Lock, DeviceFloppy, ArrowBack, Check, AlertCircle } from 'tabler-icons-react';
import { useForm, zodResolver } from "@mantine/form";
import { useMutation } from "react-query";
import { notifications } from "@mantine/notifications";
import { SignUp } from "../../api/auth.api";
import { ErrorMutation } from "../../api/type.api";

const ROLE = ['Admin', 'Relawan', 'Timsukses', 'Partai', 'Saksi'] as const;
const schema = z
    .object({
        username: z
            .string({ required_error: 'nama pengguna harus di isi' })
            .min(6, { message: 'nama pengguna minimal 6 karakter' }),
        role: z.enum(ROLE, {
            invalid_type_error: 'tipe data tidak valid',
            required_error: "role harus di isi"
        }),
        password: z.string({ required_error: "password tidak bisa kosong" })
            .min(6, { message: "password minimal 6 karakter" }),
        confirmPassword: z.string().optional(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Kata Sandi dan Konfirmasi Sandi Tidak Cocok',
        path: ['confirmPassword'],
    });

type InputForm = z.infer<typeof schema>;

export default function PostPengguna() {
    const navigate = useNavigate();
    const form = useForm({
        validate: zodResolver(schema),
        initialValues: {
            username: '',
            password: '',
            confirmPassword: '',
            role: '',
        },
    });
    const mutation = useMutation({
        mutationFn: SignUp,
        mutationKey: ["PostUser"],
        onError: (error: ErrorMutation) => {
            if (error?.code === 409) {
                notifications.update({
                    id: 'post-user',
                    color: 'red',
                    title: 'Gagal Simpan Data',
                    autoClose: 5000,
                    message: 'proses simpan data pengguna ke server gagal, nama pengguna sudah terdaftar!',
                    icon: <AlertCircle size="1.5rem" />,
                });
            }

            if (error?.code === 400) {
                notifications.update({
                    id: 'post-user',
                    color: 'red',
                    title: 'Gagal Simpan Data',
                    autoClose: 5000,
                    message: 'simpan data pengguna ke server gagal, nama pengguna sudah terdaftar!',
                    icon: <AlertCircle size="1.5rem" />,
                });
            }
        },
        onSuccess: async () => {
            notifications.update({
                id: 'post-user',
                color: 'green',
                title: 'Berhasil Simpan Data',
                autoClose: 5000,
                message: 'simpan data pengguna ke server berhasil',
                icon: <Check size="1.5rem" />,
            });
            navigate(-1);
        },
    });


    const handleSubmit = (val: InputForm) => {
        console.log(val)
        notifications.show({
            id: 'post-user',
            color: 'blue',
            loading: true,
            title: 'Simpan Data Pengguna',
            autoClose: !mutation.isLoading,
            withCloseButton: false,
            message: 'proses simpan data pengguna ke server',
        });
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
                        <Title order={4}>TAMBAH PENGGUNA</Title>
                        <Divider mb='lg' mt='sm' />
                        <TextInput
                            withAsterisk
                            label='Nama Pengguna'
                            autoComplete='Nama Pengguna'
                            icon={<User size={18} />}
                            {...form.getInputProps("username")}
                        />
                        <PasswordInput
                            withAsterisk
                            label='Kata Sandi'
                            autoComplete="kata sandi"
                            icon={<Lock size={18} />}
                            mt='md'
                            {...form.getInputProps('password')}
                        />
                        <PasswordInput
                            withAsterisk
                            label='Konfirmasi Sandi'
                            autoComplete="konfirmasi sandi"
                            icon={<Lock size={18} />}
                            mt='md'
                            {...form.getInputProps('confirmPassword')}
                        />
                        <Select
                            required
                            clearable
                            description='Pilih Peran sesuai posisi Anggota'
                            label='Peran'
                            placeholder='Pilih Salah Satu'
                            defaultValue={'Relawan'}
                            data={[
                                { value: 'Admin', label: 'Admin' },
                                { value: 'Relawan', label: 'Relawan' },
                                { value: 'Timsukses', label: 'Timsukses' },
                                { value: 'Partai', label: 'Partai' },
                            ]}
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