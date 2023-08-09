import React, { useState } from "react";
import {
    Group,
    Pagination,
    Select,
    Table as CTable,
    Text,
    TextInput,
} from "@mantine/core";

import type { SortingState, PaginationState } from "@tanstack/react-table";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowsDown, ArrowsUp, Search } from "tabler-icons-react";

type Props = {
    data: Array<{}>;
    columns: any;
    visibility: {};
};

const DataTable: React.FC<Props> = ({ columns, data, visibility }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [columnVisibility, setColumnVisibility] = useState(visibility);
    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: 20,
        pageIndex: 0,
    });

    const table = useReactTable({
        data,
        columns,
        enableFilters: true,
        state: {
            globalFilter,
            sorting,
            columnVisibility,
            pagination,
        },
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: false, // set to true for debugging table
    });

    return (
        <>
            <Group
                grow
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}>
                <Group position="left">
                    <TextInput
                        placeholder="Cari Data...."
                        icon={<Search size={20} />}
                        value={globalFilter || ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </Group>
                <Group spacing="xs" position="right">
                    <Text size="sm">Tampilkan</Text>
                    <Select
                        value={String(table.getState().pagination.pageSize)}
                        data={[String(5), String(10), String(15), String(20)]}
                        style={{ width: "4.7rem" }}
                        onChange={(e) => table.setPageSize(Number(e))}
                    />
                    <Text size="sm">Data</Text>
                </Group>
            </Group>
            <CTable verticalSpacing="sm" striped highlightOnHover>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder ? null : (
                                        <div
                                            {...{
                                                style: header.column.getCanSort()
                                                    ? { cursor: "pointer" }
                                                    : {},
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: (
                                                    <ArrowsUp
                                                        size={16}
                                                        style={{ marginLeft: "5px", marginTop: "5px" }}
                                                    />
                                                ),
                                                desc: (
                                                    <ArrowsDown
                                                        size={16}
                                                        style={{ marginLeft: "5px", marginTop: "5px" }}
                                                    />
                                                ),
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </CTable>
            <Group
                grow
                style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                <Group>
                    <Text size="sm">{`Halaman ${table.getState().pagination.pageIndex + 1
                        } dari  ${table.getPageCount()}`}</Text>
                    <Text size="sm">
                        Total {table.getPrePaginationRowModel().rows.length} Baris
                    </Text>
                </Group>
                <Pagination
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    total={table.getPageCount()}
                    withEdges
                    onChange={(page) => {
                        table.setPageIndex(page - 1);
                    }}
                    position="right"
                    styles={(theme) => ({
                        control: {
                            "&[data-active]": {
                                backgroundImage: theme.colorScheme,
                            },
                        },
                    })}
                />
            </Group>
        </>
    );
};

export default DataTable;
