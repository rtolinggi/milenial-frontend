import { Flex, Paper } from "@mantine/core";
import DataFinal from "./DataFinal";
// import DataCircle from "./DataCircle";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';


type dataFinal = {
    title: string;
    value: string;
    diff: number;
}

const dataChart = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];


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
        <main style={{ width: "100%", padding: 20 }}>
            <Flex justify='start' align='center' direction={"column"} w="100%" wrap={"wrap"}>
                <DataFinal data={mockDataFinal} />
                {/* <DataCircle data={mockDataCircle} /> */}
            </Flex >
            <Paper w='100%' radius='md' px={10} py={20} shadow='md'>
                <Flex>
                    <ResponsiveContainer width={"100%"} height={300}>
                        <AreaChart
                            width={500}
                            height={400}
                            data={dataChart}
                            margin={{
                                top: 10,
                                right: 0,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid stroke="#f5f5f5" strokeDasharray='1 1' />
                            <XAxis dataKey="name" fontSize={12} scale='auto' />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Area type="monotone" dataKey="uv" stroke="#36A2EB" fill="#36A2EB" fontSize={8} />
                        </AreaChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width={"100%"} height={300}>
                        <AreaChart
                            width={500}
                            height={400}
                            data={dataChart}
                            margin={{
                                top: 10,
                                right: 0,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid stroke="#f5f5f5" strokeDasharray='1 1' />
                            <XAxis dataKey="name" fontSize={12} scale='auto' />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Area type="monotone" dataKey="uv" stroke="#36A2EB" fill="#36A2EB" fontSize={8} />
                        </AreaChart>
                    </ResponsiveContainer>


                </Flex>
            </Paper>
        </main>
    )
}