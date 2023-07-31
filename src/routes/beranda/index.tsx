import { Flex } from "@mantine/core";
import DataFinal from "./DataFinal";
// import DataCircle from "./DataCircle";

type dataFinal = {
    title: string;
    value: string;
    diff: number;
}

// type dataCircle = {
//     label: string;
//     stats: string;
//     progress: number;
//     color: string;
//     icon: 'up' | 'down';
// }

const mockDataFinal: Array<dataFinal> = [
    {
        "title": "Anggota",
        "value": "1.200",
        "diff": 34
    },
    {
        "title": "Pendukung",
        "value": "900.000",
        "diff": -13
    },
    {
        "title": "Relawan",
        "value": "745",
        "diff": 18
    }
]

// const mockDataCircle: Array<dataCircle> = [
//     {
//         "label": "Page views",
//         "stats": "456,578",
//         "progress": 65,
//         "color": "teal",
//         "icon": "up"
//     },
//     {
//         "label": "New users",
//         "stats": "2,550",
//         "progress": 72,
//         "color": "blue",
//         "icon": "up"
//     },
// ]

export default function Beranda() {
    return (
        <Flex direction={"column"} w="100%" wrap={"wrap"}>
            <DataFinal data={mockDataFinal} />
            {/* <DataCircle data={mockDataCircle} /> */}
        </Flex >
    )
}