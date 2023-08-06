import { Button, Group, LoadingOverlay, Pagination, Paper, Select, SimpleGrid, Text, TextInput } from "@mantine/core";
import CardAvatar from "../../components/CardAvatar";
import { Search, UserPlus } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { GetRelawanPagination } from "../../api/relawan.api";
import { ResponseRelawanWithPagination } from "../../api/type.api";
import { useState } from 'react';



export default function ContentRelawan() {
    const navigate = useNavigate();

    const [getRow, setGetRow] = useState<number>(10);
    const [getPage, setGetPage] = useState<number>(1);

    const queryRelawan = function GetDataRelawan(page: number, perPage: number) {
        const query = useQuery<ResponseRelawanWithPagination>(
            {
                queryKey: ['GetRelawanWithPagination', page, perPage],
                queryFn: () => GetRelawanPagination(page, perPage),
            }
        );
        return query;
    }

    const { data: relawan, isLoading } = queryRelawan(getPage, getRow);
    return (
        <>
            <Paper shadow='sm' radius='md' w='100%' p={12} sx={(theme) => ({
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : undefined,
                marginBottom: "20px"
            })}>
                <Button leftIcon={<UserPlus size={18} />}
                    variant='gradient'
                    onClick={() => navigate("post")}
                >
                    Tambah Relawan
                </Button>
            </Paper>
            <Paper shadow='sm' radius='md' w='100%' p={20} sx={(theme) => ({
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : undefined,
                marginBottom: "20px",
                position: 'relative'
            })}>
                <LoadingOverlay visible={isLoading} />
                <Group
                    mb={20}
                    grow
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}>
                    <Group position="left">
                        <TextInput
                            placeholder="Cari Data...."
                            icon={<Search size={20} />}
                        />
                    </Group>
                    <Group spacing="xs" position="right">
                        <Text size="sm">Tampilkan</Text>
                        <Select
                            value={getRow.toString()}
                            data={[String(10), String(20), String(30), String(40)]}
                            style={{ width: "4.7rem" }}
                            onChange={(val: any) => setGetRow(val)}
                        />
                        <Text size="sm">Data</Text>
                    </Group>
                </Group>
                <SimpleGrid
                    cols={4}
                    breakpoints={[
                        { maxWidth: 'md', cols: 1, spacing: 'xs' },
                        { maxWidth: 'lg', cols: 2, spacing: 'xs' },
                        { maxWidth: 'xl', cols: 3, spacing: 'xs' },
                    ]}
                >
                    {
                        relawan?.data.petugas.map((item) => {
                            return (
                                <CardAvatar data={item} key={item.id} />
                            )

                        })
                    }
                </SimpleGrid>
                <Group mt={20} position="apart" >
                    <Text size='sm' >Halaman {relawan && relawan.data.paginations.currentPage}
                        dari {relawan && relawan.data.paginations.totalPages} Total {relawan && relawan.data.paginations.total} Relawan</Text>
                    <Pagination
                        total={relawan ? relawan?.data.paginations.totalPages : 0}
                        // defaultValue={getPage}
                        onChange={(page) => {
                            setGetRow(page)
                        }}
                        styles={(theme) => ({
                            control: {
                                "&[data-active]": {
                                    backgroundImage: theme.colorScheme,
                                },
                            },
                        })}
                    />
                </Group>
            </Paper >
        </>
    )
}