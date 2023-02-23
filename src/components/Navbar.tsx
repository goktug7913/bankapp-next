import React, {useEffect} from "react";
import {useContext} from "react";

import AppBar from '@mui/material/AppBar';
import {Box, Button, Toolbar, Typography} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from '@mui/material/styles';

import {UserCtx} from "@/context/UserState";

import Link from "next/link";
import Image from "next/image";

import logo from "@/next.svg";
import dynamic from "next/dynamic";

function Navbar() {
    const UserContext = useContext(UserCtx);

    const theme = useTheme();
    const largeScreen = useMediaQuery(theme.breakpoints.up('md'));

    // TODO: Styling
    return(
        <AppBar position="static">
            <Box>
                <Toolbar sx={{alignContent:"center"}}>

                    <Link href={"/"}><Image src={logo} alt={"logo"} width={largeScreen ? 135:70} height={largeScreen ? 35:15}/></Link>
                    <div style={{flexGrow:1}}/>
                    {UserContext.user.account_id ? <Button LinkComponent={Link} color="primary" href="/dashboard">Dashboard</Button> : null}
                    {UserContext.user.account_id ? <Button LinkComponent={Link} color="primary" href="/settings">Settings</Button> : null}
                    {UserContext.user.account_id ? null : <Button LinkComponent={Link} color="primary" href="/login">Login</Button>}
                    {UserContext.user.account_id ? <Button LinkComponent={Link} color="error" href="/logout">Logout</Button> : <Button LinkComponent={Link} color="primary" href="/register">Register</Button>}
                    {UserContext.user.account_id&&largeScreen ? <Typography variant="body1" sx={{ml:1}}>{UserContext.user.name + " " + UserContext.user.surname}</Typography> : null}

                </Toolbar>
            </Box>
        </AppBar>

    );
}

const NavbarCSR = dynamic(() => Promise.resolve(Navbar), {
    ssr: false,
})
const map = <T,>(a: T) => <K extends keyof T>(b: K) => (c: T[K] | undefined) => {
    if (c !== undefined && typeof(a[b]) === typeof(c)) a[b] = c;
}
export default NavbarCSR;