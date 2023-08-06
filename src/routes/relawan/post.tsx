import { Box, Button, Divider, Group, Image, Paper, Select, SimpleGrid, Text, TextInput, Textarea, Title, createStyles, rem } from "@mantine/core";
import { DateInput } from "@mantine/dates";

import { Form, useNavigate } from "react-router-dom";
import * as z from 'zod';
import { DeviceFloppy, ArrowBack, Download, CloudUpload, Icons, AlertCircle, Check } from 'tabler-icons-react';
import DataProvinsi from '../../../kota_kabupaten.json';
import DataKecamatan from '../../../kecamatan.json';
import DataKelurahan from '../../../kelurahan_desa.json';
import { useRef, useState } from 'react';
import { Dropzone, MIME_TYPES, FileWithPath } from "@mantine/dropzone";
import { useMutation, useQuery } from "react-query";
import { GetUsersWithRelawan } from "../../api/users.api";
import { ResponseUsers } from "../pengguna/TablePengguna";
import { useForm, zodResolver } from "@mantine/form";
import SelectWithData from "../../components/SelectWithData";
import { ErrorMutation, Jabatan } from "../../api/type.api";
import { notifications } from "@mantine/notifications";
import { PostRelawanApi, UploadImageRelawan } from "../../api/relawan.api";
import { GetJabatan } from "../../api/jabatan.api";

const schema = z
    .object({
        id_pengguna: z
            .string({ required_error: "type data karakter, tidak bisa kosong" })
            .nonempty({ message: "nama pengguna tidak bisa kosong" }),
        no_nik: z.string({ required_error: "type data karakter, tidak bisa kosong" })
            .min(6, { message: "nik harus 16 digit" }),
        nama_lengkap: z
            .string({ required_error: "type data karakter, tidak bisa kosong" })
            .nonempty({ message: "nama lengkap tidak bisa kosong" }),
        jenis_kelamin: z.string({ invalid_type_error: 'pilih salah satu, tidak bisa kosong' })
            .nonempty({ message: "jenis kelamin tidak bisa kosong" }),
        tanggal_lahir: z.date().transform((val) => Date.parse(val.toISOString())),
        id_kota_kabupaten: z.string({ invalid_type_error: "pilih salah satu, tidak bisa kosong" }).
            nonempty({ message: "kota/kabupaten harus di isi, tidak bisa kosong" }),
        id_kecamatan: z.string({ invalid_type_error: "pilih salah satu, tidak bisa kosong" })
            .nonempty({ message: "kecamatan harus di isi, tidak boleh kosong" }),
        id_kelurahan_desa: z.string({ invalid_type_error: "pilih salah satu, tidak bisa kosong" })
            .nonempty({ message: "kelurahan/desa harus di isi, tidak boleh kosong" }),
        alamat_lengkap: z.string({ invalid_type_error: "pilih salah satu, tidak bisa kosong" })
            .nonempty({ message: "kelurahan/desa harus di isi, tidak boleh kosong" }),
        telpon: z.string({ invalid_type_error: "type data karakter,  tidak bisa kosong" })
            .nonempty({ message: "no telpon tidak bisa kosong" }),
        id_jabatan: z.number({ invalid_type_error: "pilih salah satu, tidak bisa kosong" }),
        avatar: z.any().optional(),
    });

export type InputForm = z.infer<typeof schema>;


const useStyles = createStyles((theme) => ({
    wrapper: {
        position: 'relative',
        marginBottom: rem(30),
        marginTop: 20
    },

    dropzone: {
        borderWidth: rem(1),
        paddingBottom: rem(50),
    },

    icon: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
    },

    control: {
        position: 'absolute',
        width: rem(250),
        left: `calc(50% - ${rem(125)})`,
        bottom: rem(-20),
    },
}));


type ResponseJabatan = {
    code: number;
    data: {
        jabatan_petugas: Array<Jabatan>
    };
    status: string;
    message: string;
    timestamp: string;
}

export default function PostRelawan() {

    const { data: users } = useQuery<ResponseUsers>(
        {
            queryKey: ['GetUsersWithRelawan'],
            queryFn: GetUsersWithRelawan,
            // refetchInterval: 5000,
        },
    );

    const { data: jabatan } = useQuery<ResponseJabatan>({
        queryKey: ["GetJabatan"],
        queryFn: GetJabatan,
    })

    const form = useForm({
        validate: zodResolver(schema),
        initialValues: {
            id_pengguna: "",
            no_nik: "",
            nama_lengkap: "",
            jenis_kelamin: "",
            tanggal_lahir: new Date(),
            id_kota_kabupaten: "",
            id_kecamatan: "",
            id_kelurahan_desa: "",
            alamat_lengkap: "",
            telpon: "",
            id_jabatan: "",
            avatar: ""
        },
    });

    const mutation = useMutation({
        mutationKey: ["PostRelawan"],
        mutationFn: PostRelawanApi,
        onError: (error: ErrorMutation) => {
            if (error?.code === 500) {
                notifications.update({
                    id: 'post-relawan',
                    color: 'red',
                    title: 'Gagal Simpan Data',
                    autoClose: 5000,
                    message: 'proses simpan data pengguna ke server gagal, terjadi masalah di server!',
                    icon: <AlertCircle size="1.5rem" />,
                });
            }

            if (error?.code === 400) {
                notifications.update({
                    id: 'post-relawan',
                    color: 'red',
                    title: 'Gagal Simpan Data',
                    autoClose: 5000,
                    message: 'simpan data relawan ke server gagal, data yang di nput tidak valid!',
                    icon: <AlertCircle size="1.5rem" />,
                });
            }
        },
        onSuccess: async () => {
            notifications.update({
                id: 'post-relawan',
                color: 'green',
                title: 'Berhasil Simpan Data',
                autoClose: 5000,
                message: 'simpan data relawan ke server berhasil',
                icon: <Check size="1.5rem" />,
            });

            const formData = new FormData()
            formData.append("avatar", files[0]);

            try {
                if (users && files.length !== 0) {
                    await UploadImageRelawan(users?.data.users[0].ID, formData)
                    navigate(-1);
                }
            } catch (error) {
                console.log(error)
            }

        },
    })

    const selectJabatan = jabatan?.data.jabatan_petugas.map((item) => {
        return {
            label: item.Position,
            value: item.ID,
        }
    })

    const initJabatan = [{
        label: "",
        value: "",
    }]

    const dataUsername = users?.data.users.map((user) => {
        return {
            image: "http://localhost:5000/public/foto-relawan/avatar.jpg",
            label: user.Username,
            value: user.ID,
            description: user.Role,
        }
    })

    const initData = [{
        image: "http://localhost:5000/public/foto-relawan/avatar.jpg",
        label: "",
        value: "",
        description: "",
    }]

    const { classes, theme } = useStyles();
    const openRef = useRef<() => void>(null);
    const [files, setFiles] = useState<FileWithPath[]>([]);
    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <Image
                key={index}
                src={imageUrl}
                imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
            />
        );
    });

    const Provinces = DataProvinsi.map((provinsi) => {
        return {
            value: provinsi.id,
            label: provinsi.name
        }
    });

    const Districts = DataKecamatan.map((district) => {
        return {
            value: district.id,
            label: district.name
        }
    })

    const Wards = DataKelurahan.map((ward) => {
        return {
            value: ward.id,
            label: ward.name,
        }
    })

    const navigate = useNavigate();
    const handleSubmit = (val: InputForm) => {
        notifications.show({
            id: 'post-relawan',
            color: 'blue',
            loading: true,
            title: 'Simpan Data Relawan Berhasil',
            autoClose: !mutation.isLoading,
            withCloseButton: false,
            message: 'proses simpan data relawan ke server',
        });

        const payload = {
            ...val,
            tanggal_lahir: Date.parse(val.tanggal_lahir.toString())
        }
        mutation.mutate(payload);
    };

    return (
        <>
            <Box style={{ position: 'relative', width: '100%' }}>
                {/* <LoadingOverlay visible={mutation.isLoading} /> */}
                <Form onSubmit={
                    form.onSubmit((val: any) => handleSubmit(val))
                }  >
                    <Paper shadow='md' radius='md' px='20px' py='20px' sx={(theme) => ({
                        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : undefined
                    })}>
                        <Title order={4}>TAMBAH RELAWAN</Title>
                        <Divider mb='lg' mt='sm' />
                        <SimpleGrid cols={2}
                            breakpoints={[
                                { maxWidth: 'md', cols: 1, spacing: 'md' },
                            ]}
                        >
                            <Box w='100%' >
                                <Paper p={20} radius='md' sx={(theme) => ({
                                    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0]
                                })}>
                                    <SelectWithData
                                        withAsterisk
                                        description="Jika tidak ada nama pengguna silahkan tambahkan di menu Pengguna"
                                        clearable
                                        label="Nama Pengguna"
                                        placeholder="Pilih salah satu"
                                        searchable
                                        maxDropdownHeight={400}
                                        data={dataUsername ? dataUsername : initData}
                                        {...form.getInputProps('id_pengguna')}
                                    />
                                    <TextInput
                                        withAsterisk
                                        label='No KTP'
                                        mt='md'
                                        placeholder="No KTP..."
                                        {...form.getInputProps('no_nik')}
                                    />
                                    <TextInput
                                        withAsterisk
                                        label='Nama Lengkap'
                                        mt='md'
                                        placeholder="Nama Lengkap..."
                                        {...form.getInputProps('nama_lengkap')}
                                    />
                                    <Select
                                        withAsterisk
                                        clearable
                                        label='Jenis Kelamin'
                                        mt='md'
                                        placeholder="Jenis Kelamin..."
                                        data={[
                                            { label: "Laki-Laki", value: "Lk" },
                                            { label: "Perepuan", value: "Pr" },
                                        ]}
                                        {...form.getInputProps('jenis_kelamin')}
                                    />
                                    <DateInput
                                        clearable
                                        withAsterisk
                                        label="Tanggal Lahir"
                                        placeholder="Tanggal Lahir..."
                                        maw={'100%'}
                                        valueFormat="YYYY/MM/DD"
                                        mt={'md'}

                                        {...form.getInputProps('tanggal_lahir')}
                                    />
                                    <Select
                                        clearable
                                        label="Pilih Kota/Kabupaten"
                                        placeholder="Pilih salah satu"
                                        searchable
                                        nothingFound="Kota/Kabupaten tidak ditemukan"
                                        data={Provinces}
                                        mt={'md'}
                                        {...form.getInputProps('id_kota_kabupaten')}
                                    />
                                    <Select
                                        clearable
                                        label="Pilih Kecamatan"
                                        placeholder="Pilih salah satu"
                                        searchable
                                        nothingFound="Kkecamatan tidak ditemukan"
                                        data={Districts}
                                        mt={'md'}
                                        {...form.getInputProps('id_kecamatan')}
                                    />
                                    <Select
                                        clearable
                                        label="Pilih Kelurahan/Desa"
                                        placeholder="Pilih salah satu"
                                        searchable
                                        nothingFound="Kelurahan tidak ditemukan"
                                        data={Wards}
                                        mt={'md'}
                                        {...form.getInputProps('id_kelurahan_desa')}
                                    />
                                </Paper>
                            </Box>
                            <Box w='100%' h="100%" >
                                <Paper h="100%" radius='md' p={20} sx={(theme) => ({
                                    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0]
                                })}>
                                    <TextInput
                                        withAsterisk
                                        label='Nomor Hp/Wa'
                                        autoComplete='id_pengguna'
                                        placeholder="Nomor Hp/Wa..."
                                        {...form.getInputProps('telpon')}
                                    />
                                    <Select
                                        required
                                        clearable
                                        description='Pilih jabatan relawan/anggota'
                                        label='Jabatan'
                                        placeholder='Pilih Salah Satu'
                                        data={selectJabatan ? selectJabatan : initJabatan}
                                        mt='md'
                                        {...form.getInputProps('id_jabatan')}
                                    />
                                    <Textarea
                                        placeholder="Alamat Lengkap..."
                                        label="Alamat Lengkap"
                                        mt="md"
                                        withAsterisk
                                        {...form.getInputProps('alamat_lengkap')}
                                    />
                                    <div className={classes.wrapper}>
                                        <Dropzone
                                            openRef={openRef}
                                            onDrop={setFiles}
                                            className={classes.dropzone}
                                            radius="md"
                                            accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
                                            maxSize={30 * 1024 ** 2}
                                            {...form.getInputProps('avatar')}
                                        >
                                            <div style={{ pointerEvents: 'none' }}>
                                                <Group position="center">
                                                    <Dropzone.Accept>
                                                        <Download
                                                            size={rem(50)}
                                                            color={theme.colors[theme.primaryColor][6]}
                                                            stroke={"1.5"}
                                                        />
                                                    </Dropzone.Accept>
                                                    <Dropzone.Reject>
                                                        <Icons size={rem(50)} color={theme.colors.red[6]} stroke={"1.5"} />
                                                    </Dropzone.Reject>
                                                    <Dropzone.Idle>
                                                        <CloudUpload
                                                            size={rem(50)}
                                                            color={theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black}
                                                            stroke={"1.5"}
                                                        />
                                                    </Dropzone.Idle>
                                                </Group>
                                                {files.length === 0 ?
                                                    <>
                                                        <Text ta="center" fw={700} fz="lg" >
                                                            <Dropzone.Accept>Drop files here</Dropzone.Accept>
                                                            <Dropzone.Reject>Ukuran Foto Maksimal 1MB</Dropzone.Reject>
                                                            <Dropzone.Idle>Unggah Foto</Dropzone.Idle>
                                                        </Text>
                                                        <Text ta="center" fz="sm" mt="xs" c="dimmed">
                                                            Seret&apos;n&apos;Foto dalam kotak sini untuk di unggah. Ekstensi File harus <i>.jpg, png</i> ukuran foto maksimal 1MB
                                                        </Text>
                                                    </> : previews}
                                            </div>
                                        </Dropzone>
                                        {/* openRef.current?.() */}
                                        <Button variant="gradient" className={classes.control} size="md" onClick={() => {
                                            files.length === 0 ? openRef.current?.() : setFiles([])
                                        }}>
                                            {files.length === 0 ? "Pilih Foto" : "Hapus Foto"}
                                        </Button>
                                    </div>
                                </Paper>
                            </Box>
                        </SimpleGrid>
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