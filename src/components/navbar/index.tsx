import { Divider, Group, Navbar, ScrollArea } from "@mantine/core";
import { NavContent } from "./content";
import NavFooter from "./footer";
import image from "../../assets/avatar.jpg";

interface stateNavbar {
    opened: boolean
}
export default function HeaderLayout({ opened }: stateNavbar) {
    return (
        <Navbar hidden={opened} hiddenBreakpoint={"sm"} height={"calc(100vh - 60px)"} p="xs" width={{ base: 250 }} sx={(theme) => ({
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark : theme.white,
            boxShadow: theme.shadows.md
        })}>
            <Navbar.Section grow mt="md" component={ScrollArea}>
                <NavContent />
            </Navbar.Section>
            <Divider />
            <Navbar.Section>
                <Group p="5px">
                    <NavFooter
                        image={image}
                        user={"admin"}
                        name={"rtolinggi"}
                    />
                </Group>
            </Navbar.Section>
        </Navbar >
    );
}