import {
    Box,
    Button,
    Center, Divider,
    Image,
    Paper,
    PasswordInput,
    Space,
    TextInput,
    createStyles
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import logo from "../../assets/logo.png";
import { z } from "zod";
import { Form, useNavigate } from "react-router-dom";
import { HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi2"
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "react-query";
import { SignIn } from "../../api/auth.api";
import { InputSignIn, ResponseApi, ResponseSignIn } from "../../api/type.api";
import { notifications } from "@mantine/notifications";
import { AlertCircle, Check } from "tabler-icons-react";
import { useEffect } from 'react';

const useStyles = createStyles((theme) => ({
    root: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        background:
            theme.colorScheme === "dark"
                ? "rgba(0,0,0,0.9)"
                : "rgba(255,255,255,0.05)",
        backgroundImage: "URL(background.jpg)",
        backgroundSize: 'cover',
    },
    circle: {
        position: "absolute",
        width: "180px",
        height: "180px",
        borderRadius: "100%",
    },
    positionCircleTop: {
        top: "calc(20% - 90px)",
        left: "calc(45% - 180px)",
    },
    positionCircleBottom: {
        bottom: "calc(20% - 90px)",
        right: "calc(45% - 180px)",
    },
    gardient1: {
        background:
            "linear-gradient(90deg, rgba(148,153,233,1) 0%, rgba(212,148,233,1) 100%)",
    },
    gardient2: {
        background:
            "linear-gradient(90deg, rgba(111,113,214,1) 0%, rgba(231,133,171,1) 100%)",
    },
}));

const schema = z.object({
    username: z
        .string({ required_error: 'email harus disi' }),
    password: z.string().min(1, { message: 'Kata Sandi Tidak Boleh Kosong' }),
});

// type InputForm = z.infer<typeof schema>;

const AuthLayout: React.FC = () => {
    const { classes } = useStyles();
    const navigate = useNavigate();
    const { signIn, isAuth, signOut } = useAuth();
    const form = useForm({
        validate: zodResolver(schema),
        initialValues: {
            username: '',
            password: '',
        },
    });

    useEffect(() => {
        if (isAuth) {
            navigate('/admin/beranda');
        }
    }, [isAuth]);

    const mutation = useMutation(SignIn, {
        onError: () => {
            signOut();
            notifications.update({
                id: 'post-login',
                color: 'red',
                title: 'Gagal Login',
                autoClose: 5000,
                message: 'nama pengguna atau kata sandi tidak sesuai!',
                icon: <AlertCircle size="1.5rem" />,
            });
        },
        onSuccess: async (data: ResponseApi<ResponseSignIn>) => {
            signIn(data.data.auth.access_token)
            notifications.update({
                id: 'post-login',
                color: 'green',
                title: 'Berhasil masuk',
                autoClose: 5000,
                message: 'nama pengguna dan kata sandi sesuai!',
                icon: <Check size="1.5rem" />,
            });
        }
    })

    const handleSubmit = (val: InputSignIn) => {
        notifications.show({
            id: 'post-login',
            color: 'blue',
            loading: true,
            title: 'Proses Login',
            autoClose: !mutation.isLoading,
            withCloseButton: false,
            message: 'proses login pengguna',
        });
        mutation.mutate(val)
    }

    return (
        <Box className={classes.root}>
            <Center style={{ minHeight: "100vh", width: "100%" }}>
                <main>
                    <Paper
                        withBorder
                        shadow='md'
                        p={25}
                        radius='md'
                        sx={theme => ({
                            background:
                                theme.colorScheme === 'dark'
                                    ? 'rgba(0,0,0,0.6)'
                                    : 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(8px)',
                            minWidth: '320px',
                            margin: 'auto',
                            zIndex: 2000,
                        })}>
                        {/* <LoadingOverlay visible={mutation.isLoading} /> */}
                        <Center>
                            <Image src={logo} alt='logo' width={150} />
                        </Center>
                        <Divider my='xs' label={'Selamat Datang'} labelPosition='center' />
                        <Space h='md' />
                        <Form onSubmit={form.onSubmit(val => handleSubmit(val))}>
                            <TextInput
                                withAsterisk
                                label='Nama Pengguna'
                                autoComplete='email'
                                icon={<HiOutlineUser size={18} />}
                                {...form.getInputProps('username')}
                            />
                            <PasswordInput
                                withAsterisk
                                label='Kata Sandi'
                                autoComplete='current-password'
                                icon={<HiOutlineLockClosed size={18} />}
                                mt='md'
                                {...form.getInputProps('password')}
                            />
                            <Button fullWidth mt='xl' type='submit'>
                                Masuk
                            </Button>
                        </Form>
                        <Space h='md' />
                        <Divider my='xs' labelPosition='center' />
                    </Paper>
                </main>
            </Center>
        </Box>
    );
};

export default AuthLayout;