import { Box, Button, Divider, Group, Image, LoadingOverlay, Paper, Select, SimpleGrid, Text, TextInput, Textarea, Title, createStyles, rem } from "@mantine/core";
import { DateInput } from "@mantine/dates";

import { Form, useNavigate } from "react-router-dom";
import * as z from 'zod';
import { DeviceFloppy, ArrowBack, Download, CloudUpload, Icons, AlertCircle, Check } from 'tabler-icons-react';
import DataCity from '../../../kota_kabupaten.json';
import DataDistricts from '../../../kecamatan.json';
import DataWards from '../../../kelurahan_desa.json';
import { useEffect, useRef, useState } from 'react';
import { Dropzone, MIME_TYPES, FileWithPath } from "@mantine/dropzone";
import { useMutation, useQuery } from "react-query";
import { useForm, zodResolver } from "@mantine/form";
import SelectWithData from "../../components/SelectWithData";
import { Address, ErrorMutation, Pekerjaan, ResponseApi, ResponseRelawan, StatusDukungan } from "../../api/type.api";
import { notifications } from "@mantine/notifications";
import { GetRelawan } from "../../api/relawan.api";
import { GetPekerjaan } from "../../api/pekerjaan.api";
import { GetStatusDukungan } from "../../api/statusDukungan.api";
import { PostPendukungApi } from "../../api/pendukung.api";

const schema = z
    .object({
        id_petugas: z
            .string({ required_error: "type data karakter, tidak bisa kosong" })
            .nonempty({ message: "nama pengguna tidak bisa kosong" }),
        no_nik: z.string({ required_error: "type data karakter, tidak bisa kosong" })
            .min(6, { message: "nik harus 16 digit" }),
        no_kk: z.string({ required_error: "type data karakter, tidak bisa kosong" })
            .min(6, { message: "kk harus 16 digit" }),
        nama_pendukung: z
            .string({ required_error: "type data karakter, tidak bisa kosong" })
            .nonempty({ message: "nama lengkap tidak bisa kosong" }),
        tempat_lahir: z
            .string({ required_error: "type data karakter, tidak bisa kosong" })
            .nonempty({ message: "nama lengkap tidak bisa kosong" }),
        tanggal_lahir: z.date().transform((val) => Date.parse(val.toISOString())),
        id_kota_kabupaten: z.string({ invalid_type_error: "pilih salah satu, tidak bisa kosong" }).
            nonempty({ message: "kota/kabupaten harus di isi, tidak bisa kosong" }),
        id_kecamatan: z.string({ invalid_type_error: "pilih salah satu, tidak bisa kosong" })
            .nonempty({ message: "kecamatan harus di isi, tidak boleh kosong" }),
        id_kelurahan_desa: z.string({ invalid_type_error: "pilih salah satu, tidak bisa kosong" })
            .nonempty({ message: "kelurahan/desa harus di isi, tidak boleh kosong" }),
        rt: z
            .string({ required_error: "type data karakter, tidak bisa kosong" })
            .nonempty({ message: "rt tidak bisa kosong" }),
        rw: z
            .string({ required_error: "type data karakter, tidak bisa kosong" })
            .nonempty({ message: "rw tidak bisa kosong" }),
        alamat_lengkap: z.string({ invalid_type_error: "pilih salah satu, tidak bisa kosong" })
            .nonempty({ message: "alamat lengkap harus di isi, tidak boleh kosong" }),
        agama: z
            .string({ required_error: "type data karakter, tidak bisa kosong" })
            .nonempty({ message: "agama tidak bisa kosong" }),
        id_pekerjaan: z.number({ invalid_type_error: "pilih salah satu, tidak bisa kosong" }),
        telpon: z
            .string({ required_error: "type data karakter, tidak bisa kosong" })
            .nonempty({ message: "telpon tidak bisa kosong" }),
        id_status_dukungan: z.number({ invalid_type_error: "pilih salah satu, tidak bisa kosong" }),
        foto_nik: z.any().optional(),
        foto_selfie: z.any().optional(),
        valid_dpt: z.string(),
        keterangan: z.string({ invalid_type_error: 'pilih salah satu, tidak bisa kosong' })
            .optional()
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


export default function PostPendukung() {

    const { data: relawan } = useQuery<ResponseRelawan>(
        {
            queryKey: ['GetRelawan'],
            queryFn: GetRelawan,
        },
    );

    const { data: pekerjaan } = useQuery<ResponseApi<Pekerjaan>>({
        queryKey: ["GetPekerjaan"],
        queryFn: GetPekerjaan,
    })

    const { data: statusDukungan } = useQuery<ResponseApi<StatusDukungan>>({
        queryKey: ["GetStatusDukungan"],
        queryFn: GetStatusDukungan,
    })

    const form = useForm({
        validate: zodResolver(schema),
        initialValues: {
            id_petugas: "",
            no_nik: "",
            no_kk: "",
            nama_pendukung: "",
            tempat_lahir: "",
            tanggal_lahir: new Date(),
            id_kota_kabupaten: "",
            id_kecamatan: "",
            id_kelurahan_desa: "",
            rt: "",
            rw: "",
            alamat_lengkap: "",
            agama: "",
            id_pekerjaan: "",
            telpon: "",
            id_status_dukungan: "",
            foto_nik: "",
            foto_selfie: "",
            valid_dpt: "",
            keterangan: ""
        },
        transformValues: (values) => ({
            ...values,
            valid_dpt: Boolean(values.valid_dpt)
        })
    });

    const mutation = useMutation({
        mutationKey: ["PostPendukung"],
        mutationFn: PostPendukungApi,
        onError: (error: ErrorMutation) => {
            if (error?.code === 500) {
                notifications.update({
                    id: 'post-pendukung',
                    color: 'red',
                    title: 'Gagal Simpan Data',
                    autoClose: 5000,
                    message: 'proses simpan data pendukung ke server gagal, terjadi masalah di server!',
                    icon: <AlertCircle size="1.5rem" />,
                });
            }

            if (error?.code === 400) {
                notifications.update({
                    id: 'post-pendukung',
                    color: 'red',
                    title: 'Gagal Simpan Data',
                    autoClose: 5000,
                    message: 'simpan data pendukung ke server gagal, data yang di nput tidak valid!',
                    icon: <AlertCircle size="1.5rem" />,
                });
            }
        },
        onSuccess: async () => {
            notifications.update({
                id: 'post-pendukung',
                color: 'green',
                title: 'Berhasil Simpan Data',
                autoClose: 5000,
                message: 'simpan data pendukung ke server berhasil',
                icon: <Check size="1.5rem" />,
            });
        },
    })

    const selectPekerjaan = pekerjaan?.data.pekerjaan.map((item) => {
        return {
            label: item.nama_pekerjaan,
            value: item.id,
        }
    })

    const selectStatusDukungan = statusDukungan?.data.status_dukungan.map((item) => {
        return {
            label: item.status_dukungan,
            value: item.id,
        }
    })

    const initPekerjaan = [{
        label: "",
        value: "",
    }]

    const initStatusDukungan = [{
        label: "",
        value: "",
    }]

    const dataUsername = relawan?.data.petugas.map((relawan) => {
        return {
            image: relawan.avatar,
            label: relawan.nama_lengkap,
            value: relawan.id,
            description: relawan.telpon,
        }
    })

    const initData = [{
        image: "http://localhost:5000/public/foto-relawan/avatar.jpg",
        label: "",
        value: "",
        description: "",
    }]

    const { classes, theme } = useStyles();
    const openRefNik = useRef<() => void>(null);
    const openRefSelfie = useRef<() => void>(null);
    const [filesNik, setFilesNik] = useState<FileWithPath[]>([]);
    const [filesSelfie, setFilesSelfie] = useState<FileWithPath[]>([]);
    const [dataCity, setDataCitys] = useState<Array<Address>>([]);
    const [dataDistircts, setDataDistricts] = useState<Array<Address>>([]);
    const [dataWards, setDataWards] = useState<Array<Address>>([]);

    const previewsFotoNik = filesNik.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <Image
                key={index}
                maw={200}
                mx='auto'
                src={imageUrl}
                imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
            />
        );
    });

    const previewsFotoSelfie = filesSelfie.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <Image
                key={index}
                maw={200}
                mx='auto'
                src={imageUrl}
                imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
            />
        );
    });

    useEffect(() => {
        const Citys = DataCity.map((city) => {
            return {
                value: city.id,
                label: city.name
            }
        });
        setDataCitys(Citys);
    }, [])

    const handleCitys = () => {
        const idCity = String(form.getInputProps('id_kota_kabupaten').value)
        const District = DataDistricts.map((district) => {
            return {
                value: district.id,
                label: district.name.toUpperCase(),
            }
        }).filter((district) => district.value.slice(0, 5) === idCity)
        setDataDistricts(District)
    }

    const handleDistrict = () => {
        const idDistrict = String(form.getInputProps('id_kecamatan').value)
        const Wards = DataWards.map((ward) => {
            return {
                value: ward.id,
                label: ward.name.toUpperCase(),
            }
        }).filter((ward) => ward.value.slice(0, 8) === idDistrict)
        setDataWards(Wards)
    }

    const navigate = useNavigate();

    const handleSubmit = (val: InputForm) => {
        notifications.show({
            id: 'post-pendukung',
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
                <LoadingOverlay visible={mutation.isLoading} />
                <Form onSubmit={
                    form.onSubmit((e: any) => handleSubmit(e))
                }  >
                    <Paper shadow='md' radius='md' px='20px' py='20px' sx={(theme) => ({
                        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : undefined
                    })}>
                        <Title order={4}>TAMBAH PENDUKUNG</Title>
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
                                        description="Jika tidak ada nama perekrut / relawan silahkan tambahkan di menu Relawwan"
                                        clearable
                                        label="Nama Perekrut (Relawan)"
                                        placeholder="Pilih salah satu"
                                        searchable
                                        maxDropdownHeight={400}
                                        data={dataUsername ? dataUsername : initData}
                                        {...form.getInputProps('id_petugas')}
                                    />
                                    <TextInput
                                        withAsterisk
                                        label='No KTP'
                                        mt='md'
                                        placeholder="No KTP..."
                                        {...form.getInputProps('no_nik')}
                                    />
                                    <TextInput
                                        label='No KK'
                                        mt='md'
                                        placeholder="No KK..."
                                        {...form.getInputProps('no_kk')}
                                    />
                                    <TextInput
                                        withAsterisk
                                        label='Nama Lengkap'
                                        mt='md'
                                        placeholder="Nama Lengkap..."
                                        {...form.getInputProps('nama_pendukung')}
                                    />
                                    <Select
                                        withAsterisk
                                        clearable
                                        label='Agama'
                                        mt='md'
                                        placeholder="Agama..."
                                        data={[
                                            { label: "Islam", value: "islam" },
                                            { label: "Kristen Protestan", value: "kristen protestan" },
                                            { label: "Katolik", value: "katolik" },
                                            { label: "Budha", value: "budha" },
                                            { label: "Hindu", value: "hindu" },
                                        ]}
                                        {...form.getInputProps('agama')}
                                    />
                                    <TextInput
                                        withAsterisk
                                        label='Tempat Lahir'
                                        mt='md'
                                        placeholder="Tempat Lahir"
                                        {...form.getInputProps('tempat_lahir')}
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
                                        onSelect={handleCitys}
                                        data={dataCity}
                                        mt={'md'}
                                        {...form.getInputProps('id_kota_kabupaten')}
                                    />
                                    <Select
                                        clearable
                                        label="Pilih Kecamatan"
                                        placeholder="Pilih salah satu"
                                        searchable
                                        nothingFound="Kkecamatan tidak ditemukan"
                                        onSelect={handleDistrict}
                                        data={dataDistircts}
                                        mt={'md'}
                                        {...form.getInputProps('id_kecamatan')}
                                    />
                                    <Select
                                        clearable
                                        label="Pilih Kelurahan/Desa"
                                        placeholder="Pilih salah satu"
                                        searchable
                                        nothingFound="Kelurahan tidak ditemukan"
                                        data={dataWards}
                                        mt={'md'}
                                        {...form.getInputProps('id_kelurahan_desa')}
                                    />
                                    <Group mt={10} grow>
                                        <TextInput
                                            withAsterisk
                                            label='RT'
                                            autoComplete='RT'
                                            placeholder="RT..."
                                            {...form.getInputProps('rt')}
                                        />
                                        <TextInput
                                            withAsterisk
                                            label='RW'
                                            autoComplete='RW'
                                            placeholder="RW..."
                                            {...form.getInputProps('rw')}
                                        />
                                    </Group>
                                    <Textarea
                                        placeholder="Alamat Lengkap..."
                                        label="Alamat Lengkap"
                                        mt="md"
                                        withAsterisk
                                        {...form.getInputProps('alamat_lengkap')}
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
                                        autoComplete='Nomor Hp'
                                        placeholder="Nomor Hp/Wa..."
                                        {...form.getInputProps('telpon')}
                                    />
                                    <Select
                                        required
                                        clearable
                                        description='Pilih jenis Pekerjaan'
                                        label='Pekerjaan'
                                        placeholder='Pilih Salah Satu'
                                        data={selectPekerjaan ? selectPekerjaan : initPekerjaan}
                                        mt='md'
                                        {...form.getInputProps('id_pekerjaan')}
                                    />
                                    <Select
                                        required
                                        clearable
                                        description='Pilih status dukungan'
                                        label='Status Dukungan'
                                        placeholder='Pilih Salah Satu'
                                        data={selectStatusDukungan ? selectStatusDukungan : initStatusDukungan}
                                        mt='md'
                                        {...form.getInputProps('id_status_dukungan')}
                                    />
                                    <Select
                                        withAsterisk
                                        clearable
                                        label='Valid DPT'
                                        mt='md'
                                        placeholder="Valid DPT..."
                                        data={[
                                            { label: "Ya", value: "true" },
                                            { label: "Tidak", value: "false" },
                                        ]}
                                        {...form.getInputProps('valid_dpt')}
                                    />
                                    <Textarea
                                        placeholder="Keterangan..."
                                        label="Keterangan"
                                        mt="md"
                                        {...form.getInputProps('keterangan')}
                                    />
                                    <div className={classes.wrapper}>
                                        <Dropzone
                                            openRef={openRefNik}
                                            onDrop={setFilesNik}
                                            className={classes.dropzone}
                                            radius="md"
                                            accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
                                            maxSize={1 * 1024 ** 2}
                                            {...form.getInputProps('foto_nik')}
                                        >
                                            <div style={{ pointerEvents: 'none', position: 'relative', overflow: 'hidden' }}>
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
                                                {filesNik.length === 0 ?
                                                    <>
                                                        <Text ta="center" fw={700} fz="lg" >
                                                            <Dropzone.Accept>Seret gambar kesini</Dropzone.Accept>
                                                            <Dropzone.Reject>Ukuran Foto Maksimal 1MB</Dropzone.Reject>
                                                            <Dropzone.Idle>Unggah Foto KTP</Dropzone.Idle>
                                                        </Text>
                                                        <Text ta="center" fz="sm" mt="xs" c="dimmed">
                                                            Seret foto ke dalam kotak untuk di unggah. Ekstensi File harus <i>.jpg, png</i> ukuran foto maksimal 1MB
                                                        </Text>
                                                    </> : previewsFotoNik
                                                }
                                            </div>
                                        </Dropzone>
                                        {/* openRef.current?.() */}
                                        <Button variant="gradient" className={classes.control} size="md" onClick={() => {
                                            filesNik.length === 0 ? openRefNik.current?.() : setFilesNik([])
                                        }}>
                                            {filesNik.length === 0 ? "Pilih Foto" : "Hapus Foto"}
                                        </Button>
                                    </div>
                                    <div className={classes.wrapper}>
                                        <Dropzone
                                            openRef={openRefSelfie}
                                            onDrop={setFilesSelfie}
                                            className={classes.dropzone}
                                            radius="md"
                                            accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
                                            maxSize={1 * 1024 ** 2}
                                            {...form.getInputProps('foto_selfie')}
                                        >
                                            <div style={{ pointerEvents: 'none', position: 'relative', overflow: 'hidden' }}>
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
                                                {filesSelfie.length === 0 ?
                                                    <>
                                                        <Text ta="center" fw={700} fz="lg" >
                                                            <Dropzone.Accept>Seret Foto Disini</Dropzone.Accept>
                                                            <Dropzone.Reject>Ukuran Foto Maksimal 1MB</Dropzone.Reject>
                                                            <Dropzone.Idle>Unggah Foto Lainya</Dropzone.Idle>
                                                        </Text>
                                                        <Text ta="center" fz="sm" mt="xs" c="dimmed">
                                                            Seret foto kedalam kotak untuk di unggah. Ekstensi File harus <i>.jpg, png</i> ukuran foto maksimal 1MB
                                                        </Text>
                                                    </> : previewsFotoSelfie
                                                }
                                            </div>
                                        </Dropzone>
                                        {/* openRef.current?.() */}
                                        <Button variant="gradient" className={classes.control} size="md" onClick={() => {
                                            filesSelfie.length === 0 ? openRefSelfie.current?.() : setFilesSelfie([])
                                        }}>
                                            {filesSelfie.length === 0 ? "Pilih Foto" : "Hapus Foto"}
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