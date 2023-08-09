import { forwardRef } from 'react';
import { Group, Avatar, Text, Select, SelectProps } from '@mantine/core';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string;
    label: string;
    description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ image, label, description, ...others }: ItemProps, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <Avatar src={image} />

                <div>
                    <Text size="sm">{label}</Text>
                    <Text size="xs" opacity={0.65}>
                        {description}
                    </Text>
                </div>
            </Group>
        </div>
    )
);

interface InputSelect extends SelectProps { }

export default function SelectWithData({ ...props }: InputSelect) {
    return (
        <Select
            itemComponent={SelectItem}
            maxDropdownHeight={400}
            nothingFound="Data Tidak Ditemukan"
            filter={(value, item) =>
                item.label && item?.label.toLowerCase().includes(value.toLowerCase().trim()) ||
                item.description.toLowerCase().includes(value.toLowerCase().trim())
            }
            {...props}
        />
    );
}