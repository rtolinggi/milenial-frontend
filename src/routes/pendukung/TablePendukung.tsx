import { Button, Paper } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "tabler-icons-react";

export default function TabelPendukung() {
    const navigate = useNavigate();
    return (
        <>
            <Paper shadow='sm' radius='md' w='100%' p={12} sx={(theme) => ({
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : undefined
            })}>
                <Button leftIcon={<UserPlus size={18} />}
                    variant='gradient'
                    onClick={() => navigate("post")}
                >
                    Tambah Pendukung
                </Button>
            </Paper>
        </>
    )
}