import { HiUserPlus, HiHomeModern, HiUserGroup, HiListBullet } from "react-icons/hi2";
import { BiSolidUserPin } from 'react-icons/bi';
import { Link, useLocation } from "react-router-dom";
import { Box, NavLink, ThemeIcon, useMantineTheme } from "@mantine/core";

const data = [
    {
        icon: HiHomeModern,
        label: "Beranda",
        to: "beranda",
        pathName: "/beranda",
    },
    {
        icon: HiUserPlus,
        label: "Relawan",
        to: "relawan",
        pathName: "/relawan",
    },
    {
        icon: HiUserGroup,
        label: "Pendukung",
        to: "pendukung",
        pathName: "/pendukung"
    },
    {
        icon: HiListBullet,
        label: "Daftar Pemilih Tetap",
        to: "dpt",
        pathName: "/dpt"
    },
    {
        icon: BiSolidUserPin,
        label: "Pengguna",
        to: "pengguna",
        pathName: "/pengguna"
    }
];

export const NavContent: React.FC = () => {
    const location = useLocation();
    const theme = useMantineTheme();
    const path = location.pathname.split("/");
    const pathSplit = "/" + path[2];
    const items = data.map((item, idx) => (
        <NavLink
            key={idx}
            variant="light"
            component={Link}
            to={item.to}
            active={pathSplit === item.pathName}
            label={item.label}
            icon={
                <ThemeIcon color={theme.primaryColor} variant="light">
                    <item.icon size={16} stroke={1.5} />
                </ThemeIcon>
            }>
        </NavLink>
    ));

    return <Box sx={{ width: "100%" }}>{items}</Box>;
};
