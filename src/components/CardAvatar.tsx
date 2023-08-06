import { Avatar, Box, Card, Center, Divider, Flex, Group, Text, createStyles, rem } from "@mantine/core";
import { MapPin, UserCheck } from "tabler-icons-react";
// import { Petugas } from "../api/type.api";

const useStyles = createStyles((theme) => ({
    root: {
        position: 'relative',
        padding: "10px",
        minWidth: 250,
    },
    wrapper: {
        background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
        padding: "10px",
        height: '5rem',
    },
    avatar: {
        borderWidth: '0.4rem',
        borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : 'white',
        borderStyle: 'solid',
        cursor: 'pointer',
        height: rem(120),
        width: rem(120),
        borderRadius: '50%',
        transition: "width 0.3s, height 0.3s",

        ":hover": {
            width: rem(125),
            height: rem(125),
            borderRadius: '50%'
        },
    },
}))

export default function CardAvatar(data: any) {
    const { classes } = useStyles();
    return (
        <Card className={classes.root} radius='md' withBorder>
            <Card.Section >
                <Center className={classes.wrapper}>
                    <Avatar variant="gradient" className={classes.avatar} bottom={-40} src={`http://localhost:5000/public/foto-relawan/${data.data.avatar}`} />
                </Center>
            </Card.Section>
            <Box mt="4.2rem" >
                <Text align="center" weight='bold'>{data.data.nama_lengkap}</Text>
                <Text size={12} align="center" >{data.data.telpon}</Text>
            </Box>

            <Divider my={20} color="blue" />
            <Box >
                <Group spacing='xs' position="apart">
                    <Flex justify='center' align='center'>
                        <UserCheck color="green" width={15} />
                        <Text ml={5} align="start" size={12} weight='bold'>{data.data.id_jabatan}</Text>
                    </Flex>
                    <Text size={12} align="center" >120.000</Text>
                </Group>
            </Box>
            <Box >
                <Group spacing='xs' position="apart">
                    <Flex justify='center' align='center'>
                        <MapPin color="red" width={15} />
                        <Text ml={5} align="start" size={12} weight='bold'>Area</Text>
                    </Flex>
                    <Text size={12} align="center" >Malalayang</Text>
                </Group>
            </Box>
        </Card >
    )
}