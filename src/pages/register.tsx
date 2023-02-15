//import useToken from "../hooks/useToken";
import React, {useState} from "react";
import {Alert, Box, Button, Checkbox, Container, FormControlLabel, TextField} from "@mui/material";
import {useRouter} from "next/router";

interface IRegister {
    account_id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
}

export const Register = () => {
    const [account, setAccount] = useState<IRegister>({} as IRegister);
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    //const [saveToken] = useToken();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (account.password !== password2) {
            setError("Passwords do not match");
        }
        else {
            try {
                setLoading(true);
                //const response = await axiosInstance.post("/register", account);
                //console.log(response.data);
                //saveToken(response.data.token);
                await router.replace("/dashboard");
            } catch (e) {
                setLoading(false)
                setError("An error occurred");
            }
        }
    };

    return (
        <Container>
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
                <FormControlLabel control={<Checkbox value="tos" color="primary" />} label="I agree to the Terms of Service"/>
                {error && <Alert severity="error">{error}</Alert>}
                <Button disabled={loading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Register</Button>
            </Box>
        </Container>
    );
};