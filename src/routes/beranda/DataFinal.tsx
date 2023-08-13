import { createStyles, Group, Paper, Text, ThemeIcon, SimpleGrid } from '@mantine/core';
import { ArrowUpRight, ArrowDownRight } from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
    root: {
        padding: `calc(${theme.spacing.xl} * 2)`,
    },

    label: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
}));

interface StatsGridIconsProps {
    data: { title: string; value: string; diff: number }[];
}

export default function DataFinal({ data }: StatsGridIconsProps) {
    const { classes } = useStyles();
    const stats = data.map((stat) => {

        return (
            <Paper withBorder p="md" radius="md" key={stat.title}>
                <Group position="apart">
                    <div>
                        <Text c="dimmed" tt="uppercase" fw={700} fz="xs" className={classes.label}>
                            {stat.title}
                        </Text>
                        <Text fw={700} fz="xl">
                            {stat.value}
                        </Text>
                    </div>
                    <ThemeIcon
                        color="gray"
                        variant="light"
                        sx={(theme) => ({ color: stat.diff > 0 ? theme.colors.teal[6] : theme.colors.red[6] })}
                        size={38}
                        radius="md"
                    >
                        {stat.diff > 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={30} />}
                    </ThemeIcon>
                </Group>
                <Text c="dimmed" fz="sm" mt="md">
                    <Text component="span" c={stat.diff > 0 ? 'teal' : 'red'} fw={700}>
                        {stat.diff}%
                    </Text>{' '}
                    {stat.diff > 0 ? 'kenaikan' : 'penurunan'} berbanding dengan bulan kemarin
                </Text>
            </Paper>
        );
    });

    return (
        <div className={classes.root}>
            <SimpleGrid w={'100%'} cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                {stats}
            </SimpleGrid>
        </div>
    );
}