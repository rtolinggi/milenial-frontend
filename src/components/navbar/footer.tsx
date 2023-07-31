import {
    UnstyledButton,
    type UnstyledButtonProps,
    Group,
    Avatar,
    Text,
    createStyles,
} from "@mantine/core";
import { RiLogoutCircleRLine } from "react-icons/ri";

const useStyles = createStyles((theme) => ({
    user: {
        display: "block",
        width: "100%",
        padding: "10px",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        borderRadius: theme.radius.md,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.grape[0],
        },
    },
}));

interface UserButtonProps extends UnstyledButtonProps {
    image: string;
    user: string;
    name: string;
    icon?: React.ReactNode;
}

export default function NavFooter({
    image,
    user,
    name,
    icon,
    ...others
}: UserButtonProps) {
    const { classes } = useStyles();

    return (
        <UnstyledButton className={classes.user} {...others}>
            <Group>
                <Avatar src={image} radius="xl" size="md" />

                <div style={{ flex: 1 }}>
                    <Text size="sm" weight={500}>
                        {user}
                    </Text>

                    <Text color="dimmed" size="xs">
                        {name}
                    </Text>
                </div>

                {icon || <RiLogoutCircleRLine size={20} stroke={1.5} />}
            </Group>
        </UnstyledButton>
    );
}
