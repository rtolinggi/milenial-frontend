import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { Edit, EyeCheck, Trash } from "tabler-icons-react";
import type { UseMutationResult } from "react-query";
import { useNavigate } from "react-router-dom";

type Props = {
    userId: string;
    userName: string;
    mutation?: UseMutationResult;
};

export default function ActionButton({
    userId,
    userName,
    mutation,
}: Props) {
    const navigate = useNavigate();

    return (
        <Group spacing="xs">
            <ThemeIcon color="grape" variant="light" style={{ cursor: "pointer" }}>
                <UnstyledButton onClick={() => navigate(`${userId}/detail`)}>
                    <EyeCheck size={20} />
                </UnstyledButton>
            </ThemeIcon>
            <ThemeIcon color="red" variant="light" style={{ cursor: "pointer" }}>
                <UnstyledButton
                    onClick={() =>
                        openConfirmModal({
                            title: "Hapus",
                            centered: true,
                            children: (
                                <Text size="sm">
                                    Apakah yakin akan menghapus Data dengan User {userName}?
                                </Text>
                            ),
                            labels: {
                                confirm: "Hapus",
                                cancel: "Batal",
                            },
                            onCancel: () => console.log("Cancel"),
                            onConfirm: () => mutation?.mutate(userId),
                        })
                    }>
                    <Trash size={20} />
                </UnstyledButton>
            </ThemeIcon>
            <ThemeIcon color="lime" variant="light" style={{ cursor: "pointer" }}>
                <UnstyledButton
                    onClick={() => navigate(`${userId}/update`)}
                    type="submit"
                    name="action"
                    value="updateStore">
                    <Edit size={20} />
                </UnstyledButton>
            </ThemeIcon>
        </Group>
    );
};
