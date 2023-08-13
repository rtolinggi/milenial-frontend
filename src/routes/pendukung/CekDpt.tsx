import { Box, Button, Divider, Group, LoadingOverlay, Paper, ScrollArea, Select, SimpleGrid, Table, Text, TextInput, Title } from "@mantine/core";
import DataCity from '../../../kota_kabupaten.json';
import DataDistricts from '../../../kecamatan.json';
import DataWards from '../../../kelurahan_desa.json';
import { useState, useEffect } from 'react';
import { Address } from "../../api/type.api";
import { useForm, zodResolver } from "@mantine/form";
import * as z from 'zod';
import { GetDptWihParams } from "../../api/dpt.api";
import { DataDpt } from "../dpt/TableDpt";
import { useNavigate } from "react-router-dom";

const schema = z
    .object({
        nama_pendukung: z
            .string({ required_error: "type data karakter, tidak bisa kosong" })
            .nonempty({ message: "nama lengkap tidak bisa kosong" }),
        id_kota_kabupaten: z.string({ invalid_type_error: "pilih salah satu, tidak bisa kosong" }).
            nonempty({ message: "kota/kabupaten harus di isi, tidak bisa kosong" }),
        id_kecamatan: z.string({ invalid_type_error: "pilih salah satu, tidak bisa kosong" })
            .nonempty({ message: "kecamatan harus di isi, tidak boleh kosong" }),
        id_kelurahan_desa: z.string({ invalid_type_error: "pilih salah satu, tidak bisa kosong" })
            .nonempty({ message: "kelurahan/desa harus di isi, tidak boleh kosong" }),
        jenis_kelamin: z.string({ invalid_type_error: "pilih salah satu, tidak bisa kosong" })
            .nonempty({ message: "jenis kelamin harus di isi, tidak boleh kosong" }),
    });

export type InputForm = z.infer<typeof schema>;

type ResponseDpt = {
    dpt: Array<DataDpt>
}

export default function TabelPendukung() {
    const navigate = useNavigate();
    const [dataCity, setDataCitys] = useState<Array<Address>>([]);
    const [dataDistircts, setDataDistricts] = useState<Array<Address>>([]);
    const [dataWards, setDataWards] = useState<Array<Address>>([]);
    const [dataDpt, setDataDpt] = useState<ResponseDpt | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)



    const form = useForm({
        validate: zodResolver(schema),
        initialValues: {
            nama_pendukung: "",
            id_kota_kabupaten: "",
            id_kecamatan: "",
            id_kelurahan_desa: "",
            jenis_kelamin: "",
        },
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

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const resultForm = form.validate();
        if (resultForm.hasErrors) {
            return
        }

        const kodeArea = String(form.getInputProps('id_kelurahan_desa').value).toUpperCase();
        const jenisKelamin = String(form.getInputProps('jenis_kelamin').value).toUpperCase();
        const nama = String(form.getInputProps('nama_pendukung').value).toUpperCase();

        setIsLoading(true)
        const result = await GetDptWihParams(kodeArea, jenisKelamin, nama);
        const response = await result.data;
        setDataDpt(response)
        setIsLoading(false)
    };

    return (
        <>
            <Paper shadow='sm' radius='md' w='100%' p='lg' sx={(theme) => ({
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : undefined
            })}>
                <LoadingOverlay visible={isLoading} />
                <Title order={4}>CEK DAFTAR PEMILIH TETAP (DPT)</Title>
                <Divider mb='sm' mt='sm' />
                <SimpleGrid cols={3} mb="lg"
                    breakpoints={[
                        { maxWidth: 'md', cols: 1, spacing: 'md' },
                    ]}
                >
                    <Select
                        withAsterisk
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
                        withAsterisk
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
                        withAsterisk
                        clearable
                        label="Pilih Kelurahan/Desa"
                        placeholder="Pilih salah satu"
                        searchable
                        nothingFound="Kelurahan tidak ditemukan"
                        data={dataWards}
                        mt={'md'}
                        {...form.getInputProps('id_kelurahan_desa')}
                    />
                    <Select
                        withAsterisk
                        clearable
                        label='Jenis Kelamin'
                        placeholder="Jenis Kelamin..."
                        data={[
                            { label: "Laki-Laki", value: "L" },
                            { label: "Perempuan", value: "P" },
                        ]}
                        {...form.getInputProps('jenis_kelamin')}
                    />
                    <TextInput
                        withAsterisk
                        label='Nama Lengkap Sesuai KTP'
                        placeholder="Nama Lengkap..."
                        {...form.getInputProps('nama_pendukung')}
                    />
                    <Group w='100%' grow>
                        <Button onClick={handleSubmit} mt={23} variant="gradient" type="submit">CEK DPT</Button>
                        <Button onClick={() => navigate(-1)} variant="gradient" mt={23}>KEMBALI</Button>
                    </Group>
                </SimpleGrid>
                <ScrollArea w='100%' type="hover">
                    <Table striped mt={70} verticalSpacing='xs'>
                        <thead>
                            <tr>
                                <th>Nama Terdaftar</th>
                                <th>Jenis Kelamin</th>
                                <th>Usia</th>
                                <th>Desa/Kelurahan</th>
                                <th>RT</th>
                                <th>RW</th>
                                <th>TPS</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataDpt?.dpt !== null ?
                                dataDpt?.dpt.map((item) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                {item.nama}
                                            </td>
                                            <td>
                                                {item.jenis_kelamin === "L" ? "LAKI-LAKI" : "PEREMPUAN"}
                                            </td>
                                            <td>
                                                {item.usia}
                                            </td>
                                            <td>
                                                {item.desa_kelurahan}
                                            </td>
                                            <td>
                                                {item.rt}
                                            </td>
                                            <td>
                                                {item.rw}
                                            </td>
                                            <td>
                                                {item.tps}
                                            </td>
                                            <td>
                                                <div>
                                                    <Button onClick={() => {
                                                        navigate('../post', {
                                                            state: {
                                                                prop: item,
                                                            }
                                                        })
                                                    }} variant="outline">Tambah Pendukung</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }) :
                                <tr><td></td></tr>
                            }
                        </tbody>
                    </Table>

                </ScrollArea>
                {
                    dataDpt?.dpt === null ?
                        <Box color="red" h={20} style={{ width: '100%' }}>
                            <Text align="center" size='sm'>Data tidak ditemukan</Text>
                        </Box> : undefined
                }
            </Paper >
        </>
    )
}