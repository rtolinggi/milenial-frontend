import { Title } from "@mantine/core";
import { useQuery } from "react-query";
import { GetUsers } from "../../api/users.api";

export default function Pengguna() {
    const { data: users, isLoading, isError, isSuccess } = useQuery({
        queryKey: "users",
        queryFn: GetUsers,
    });

    console.log(users)
    console.log
    return (
        <>
            {isLoading && <Title>Loading...</Title>}
            {isSuccess ? <Title>{users.data.users[1].Username}</Title> : undefined}
            {isError && <Title>Error Fetching</Title>}
        </>
    )
}