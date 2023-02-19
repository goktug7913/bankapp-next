//import useToken from "../hooks/useToken";
import React, {useContext, useEffect, useState} from "react";
import {Alert, Box, Button, Checkbox, Container, FormControlLabel, TextField} from "@mui/material";
import {useRouter} from "next/router";
import {trpc} from "@/utils/trpc";
import {UserCtx} from "@/context/UserState";

interface IRegister {
    account_id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
}

export default function Register()
{
    const [account, setAccount] = useState<IRegister>({} as IRegister);
    const [password2, setPassword2] = useState("");
    const [tos, setTos] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const user = useContext(UserCtx);
    const router = useRouter();
    const registerCall = trpc.register.useMutation();


    useEffect(() => {
        if (registerCall.error) {
            setError(registerCall.error.message);
        }
    }, [registerCall.error]);

    useEffect(() => {
        if(registerCall.isSuccess && !registerCall.isLoading) {
            console.log("Success");
            setLoading(false);

            console.log(registerCall.data);
            user.setUser(registerCall.data.user as any);

            router.replace("/dashboard").then(() => {
                window.location.reload();
            });
        }
    }, [registerCall.isSuccess, registerCall.isLoading , registerCall.data]);

    useEffect(() => {
        if (user.user.account_id !== "") {
            router.push("/dashboard");
        }
    }, [user.user.account_id]);

    useEffect(() => {
        setLoading(registerCall.isLoading);
    }, [registerCall.isLoading]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (account.password !== password2) { setError("Passwords do not match") }
        else if (!tos) { setError("You must agree to the terms of service") }
        else {
            registerCall.mutate(account);
        }
    };

    return (
        <Container maxWidth={"sm"}>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <h1>Register</h1>
                <TextField margin="normal" required fullWidth autoFocus
                           type="text"
                           value={account.account_id}
                           onChange={(e) => setAccount({...account, account_id: e.target.value})}
                           placeholder="ID Number"
                />
                <TextField margin="normal" required fullWidth autoFocus
                           type="text"
                           value={account.name}
                           onChange={(e) => setAccount({...account, name: e.target.value})}
                           placeholder="Name"
                />
                <TextField margin="normal" required fullWidth
                           type="text"
                           value={account.surname}
                           onChange={(e) => setAccount({...account, surname: e.target.value})}
                           placeholder="Surname"
                />
                <TextField margin="normal" required fullWidth
                           type="email"
                           value={account.email}
                           onChange={(e) => setAccount({...account, email: e.target.value})}
                           placeholder="Email"
                />
                <TextField margin="normal" required fullWidth
                           type="password"
                           value={account.password}
                           onChange={(e) => setAccount({...account, password: e.target.value})}
                           placeholder="Password"
                />
                <TextField margin="normal" required fullWidth
                           type="password"
                           value={password2}
                           onChange={(e) => setPassword2(e.target.value)}
                           placeholder="Confirm password"
                />
                <FormControlLabel control={<Checkbox value={tos} color="primary" onChange={ (e) => setTos(e.target.checked)} />} label="I agree to the Terms of Service"/>

                {error && <Alert severity="error">{error}</Alert>}
                <Button disabled={loading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Register</Button>
            </Box>
        </Container>
    );
};