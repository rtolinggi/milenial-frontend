import { Burger, Group, Header, Image, MediaQuery, Text, useMantineTheme } from "@mantine/core";
import image from "../../assets/logo.png";
import DarkMode from "../darkMode";


interface Props {
    initialState: boolean;
    handler: {
        open: () => void,
        close: () => void,
        toggle: () => void,
    }
}

export default function HeaderLayout({ initialState, handler }: Props) {
    const theme = useMantineTheme();

    // const [opened, setOpened] = useState(false);
    return (
        <Header height={{ base: 60 }} py="md" px="xl" sx={(theme) => ({
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark : theme.white,
            boxShadow: theme.shadows.md
        })}>
            <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: "space-between" }}>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <Burger
                        opened={initialState}
                        onClick={() => handler.toggle()}
                        size="sm"
                        color={theme.colors.gray[6]}
                        mr="xl"
                    />
                </MediaQuery>

                <Group spacing={"sm"}>
                    <Image src={image} width={55} />
                    <Text fz={"xl"} fw={900} variant="gradient">Milenial Sulut</Text>
                </Group>
                <DarkMode />
            </div>
        </Header>
    );
}