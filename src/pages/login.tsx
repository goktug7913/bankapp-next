import React, {useContext, useState} from "react";
import {
    Alert,
    Box,
    Button,
    Checkbox, CircularProgress,
    Container,
    Fade,
    FormControlLabel,
    FormLabel, TextField
} from "@mui/material";

import Link from "next/link";
import {useRouter} from "next/router";
import {UserCtx} from "@/context/UserState";
import {trpc, setAuthToken} from "@/utils/trpc";
import dynamic from "next/dynamic";

function Login() {

    const router = useRouter();
    const UserContext = useContext(UserCtx);
    // If the user is already logged in, let's redirect them to the dashboard
    if (!UserContext.user) {
        //router.push("/dashboard");
    }

    const [user, setUser] = useState({account_id: "", password: ""});
    const [error, setError] = useState("");


    const Login = trpc.login.useMutation({
        onSuccess: (data) => {
            UserContext.setUser(data.user as any); // TODO: Fix user Interface
            console.log("Success");

            router.push("/dashboard").then();
        },
        onError: (err) => {
            setError(err.message);
        }
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Let's clear the error message if there is one
        setError("");
        Login.mutate(user);
    }

    return(
        <Container maxWidth={"sm"}>
            <h1>Please Log In</h1>

            <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
                <TextField margin="normal" required fullWidth autoFocus label="Account ID" type="text" onChange={e => setUser({...user, account_id: e.target.value})}/>
                <TextField margin="normal" required fullWidth label="Password" type="password" onChange={e => setUser({...user, password: e.target.value})}/>
                <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me"/>

                <Button type="submit" fullWidth variant="contained" disabled={Login.isLoading} sx={{ mt: 3, mb: 2 }}>{Login.isLoading ? <CircularProgress color="primary" /> : "Submit"}</Button>

                <FormLabel>No account yet? <Link href="/register">Register</Link></FormLabel>

                <Fade in={error !== ""} style={{transitionDuration: "500ms"}}>
                    <Alert severity="error">{error}</Alert>
                </Fade>

                <Fade in={true} style={{transitionDuration: "500ms"}}>
                    <Alert severity="info">
                        You can use the testing account <br/>
                        Account ID: 12341234123 <br/>
                        Password: 12341234
                    </Alert>
                </Fade>
            </Box>
        </Container>
    )
}

const LoginCSR = dynamic(() => Promise.resolve(Login), {
    ssr: false,
})

export default LoginCSR