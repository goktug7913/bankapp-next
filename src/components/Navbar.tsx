import React from "react";
import {useContext} from "react";

import AppBar from '@mui/material/AppBar';
import {Box, Button, Container, Toolbar, Typography} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import {UserCtx} from "@/context/UserState";

import Link from "next/link";
import Image from "next/image";

import logo from "@/next.svg";
import dynamic from "next/dynamic";

// Horizontal navigation bar
// Login and logout buttons, and a link to the home page
// Dashboard button is only visible when logged in
// Login button is only visible when logged out
// Logout button is only visible when logged in

function Navbar() {
    const UserContext = useContext(UserCtx);

    const logout = () => {
        sessionStorage.removeItem('user');
        // We will get redirected to the home page by a href
    }

    const largeScreen = useMediaQuery((theme: { breakpoints: { up: (arg0: string) => any; }; }) => theme.breakpoints.up('md'));

    // TODO: Styling
    return(
        <AppBar position="static">
            <Box>
                <Toolbar sx={{alignContent:"center"}}>

                    <Link href={"/"} style={{display:"flex"}}><Image src={logo} alt={"logo"} width={145} height={45}/></Link>
                    <div style={{flexGrow:1}}/>
                    {UserContext.user.account_id ? <Button LinkComponent={Link} color="primary" href="/dashboard">Dashboard</Button> : null}
                    {UserContext.user.account_id ? <Button LinkComponent={Link} color="primary" href="/settings">Settings</Button> : null}
                    {UserContext.user.account_id ? null : <Button LinkComponent={Link} color="primary" href="/login">Login</Button>}
                    {UserContext.user.account_id ? <Button LinkComponent={Link} color="primary" href="/logout" onClick={logout}>Logout</Button> : <Button LinkComponent={Link} color="primary" href="/register">Register</Button>}
                    {UserContext.user.account_id&&largeScreen ? <Typography variant="body1" sx={{ml:1}}>{UserContext.user.name + " " + UserContext.user.surname}</Typography> : null}

                </Toolbar>
            </Box>
        </AppBar>

    );
}

const NavbarCSR = dynamic(() => Promise.resolve(Navbar), {
    ssr: false,
})

export default NavbarCSR