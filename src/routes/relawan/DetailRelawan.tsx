import { Avatar, Flex, Paper, Title, Box } from "@mantine/core";
import { queryClient } from "../../App";
import { ResponseRelawanWithPagination } from "../../api/type.api";
import { useLocation, useParams } from "react-router-dom";

export default function DetailRelawan() {
    const { id } = useParams();
    const location = useLocation();
    const queryParams = location.state;

    let page: any = 1;
    let row: any = 10;

    if (queryParams) {
        page = queryParams.page;
        row = queryParams.row;
    }

    const queryData = queryClient.getQueryState<ResponseRelawanWithPagination>([
        "getRelawanPagination",
        page,
        row,
    ]);

    const data = queryData?.data;
    const relawan = data?.data.petugas.filter((val) => val.id === id)

    console.log(relawan)
    return (
        <>
            <Paper shadow='sm' radius='md' w='100%' p={12} sx={(theme) => ({
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : undefined,
                marginBottom: "20px",
                padding: "20px",
                height: '160px',
            })}>
                <Flex h='140px' align='center' justify='start'>
                    <Avatar radius='md' w={170} h='100%' src={`http://localhost:5000/public/foto-relawan/${relawan && relawan[0].avatar}`} />
                    <Box w='100%' h='100%' ml={10}>
                        <Title underline order={3}>Informasi Relawan</Title>

                    </Box>
                </Flex>
            </Paper>
        </>
    )
}