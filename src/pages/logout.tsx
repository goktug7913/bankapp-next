import {useContext, useEffect} from "react";
import {UserCtx} from "@/context/UserState";
import {useRouter} from "next/router";
import {CircularProgress, Container, Paper, Typography} from "@mui/material";

export default function Logout() {

    const UserContext = useContext(UserCtx);
    const router = useRouter()

    useEffect(() => {
        router.push("/").then(
            () => {
                // Clear user data
                UserContext.setUser({} as any);
                // Clear session storage
                sessionStorage.clear();
            }
        );
    },[])

    return (
        <Container>
            <Paper sx={{ p: 2, mt: 2, mx: 3 }}>
                <Typography variant="h4">Logging out...</Typography>
                <CircularProgress color="primary" />
            </Paper>
        </Container>
    )
}