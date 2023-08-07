import { Button, Paper, Table, Title, createStyles } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { queryClient } from "../../App";
import { ResponseApi } from "../../api/type.api";
import { ArrowBack } from "tabler-icons-react";
import { User } from "../../api/users.api";

const useStyles = createStyles((theme) => ({
    container: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : undefined,
        width: '100%',
        padding: 12
    }
}))

export default function DetailPengguna() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryData = queryClient.getQueryState<ResponseApi<User>>("GetUsers")
    console.log(queryData)
    const data = queryData?.data
    const user = data?.data.users?.filter((user) => user.ID === id).map((value) => {
        return {
            ...value,
            CreatedAt: new Date(value.CreatedAt).toLocaleString(["ban", "id"]),
            UpdatedAt: new Date(value.UpdatedAt).toLocaleString(["ban", "id"]),
        }
    })
    const { classes } = useStyles();
    return (
        <>
            <Paper className={classes.container}>
                <Title order={3} mx={10} my={10}>DETAIL DATA PENGGUNA</Title>
                <Table verticalSpacing={"lg"}>
                    <tbody >
                        <tr>
                            <td style={{ fontWeight: 'bold' }}>ID PENGGUNA</td>
                            <td style={{ fontWeight: 'inherit' }}>: {id}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 'bold' }}>NAMA PENGGUNA</td>
                            <td style={{ fontWeight: 'inherit' }}>: {user && user[0].Username.toUpperCase()}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 'bold' }}>STATUS</td>
                            <td style={{ fontWeight: 'inherit' }}>: {user && user[0].IsActive ? "AKTIF" : "TIDAK AKTIF"}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 'bold' }}>PERAN</td>
                            <td style={{ fontWeight: 'inherit' }}>: {user && user[0].Role.toUpperCase()}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 'bold' }}>Di BUAT</td>
                            <td style={{ fontWeight: 'inherit' }}>: {user && user[0].CreatedAt}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 'bold' }}>Di PERBARUI</td>
                            <td style={{ fontWeight: 'inherit' }}>: {user && user[0].UpdatedAt}</td>
                        </tr>
                    </tbody>
                </Table>
                <Button variant="gradient" m={10} onClick={() => navigate(-1)} leftIcon={<ArrowBack size={16} />}>Kembali</Button>
            </Paper>
        </>
    )
}