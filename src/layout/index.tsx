import { AppShell, Breadcrumbs, Flex, Group } from "@mantine/core";
import Navbar from "../components/navbar";
import HeaderLayout from "../components/header";
import { Outlet, useMatches } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";



export default function AdminLayout() {
    let matches = useMatches();
    const [opened, handlers] = useDisclosure(false);
    let crumbs = matches
        .filter((match: any) => Boolean(match.handle?.crumb))
        .map((match: any) => match.handle.crumb(match.data));
    return (
        <AppShell
            padding="md"
            fixed={true}
            navbarOffsetBreakpoint="sm"
            navbar={<Navbar opened={opened} />}
            header={<HeaderLayout initialState={opened} handler={handlers} />}
            styles={(theme) => ({
                main: {
                    backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
                },
            })}
        >
            <Flex justify="flex-start" direction="column" align="flex-start" wrap="wrap" >
                <Group position="apart" px="md">
                    <Breadcrumbs>{crumbs.map((crumb) => crumb)}</Breadcrumbs>
                </Group>
                <Outlet />
            </Flex>
        </AppShell>
    )
}