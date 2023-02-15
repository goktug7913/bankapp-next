import React, {useContext, useEffect} from 'react';

import {
    Button,
    List,
    Stack,
    Typography,
    Divider,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';

import {UserCtx} from "@/context/UserState";
import {AccountEntry} from "@/components/AccountEntry";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid2 from "@mui/material/Unstable_Grid2";
import InventoryIcon from '@mui/icons-material/Inventory';

import {useRouter} from "next/router";

export default function Dashboard() {
    const UserContext = useContext(UserCtx).user;
    const SetUserContext = useContext(UserCtx).setUser;
    const router = useRouter();

    function CreateNewAccount() {
        // Redirect to creation page
        router.push("/createAccount");
    }

    // Let's update the user context on page load
    // This is to make sure that the user context is up-to-date
    // useEffect(() => {
    //     AxiosInstance.post("/account/", {account_id: UserContext.account_id})
    //         .then((res) => {
    //             res?.data ? SetUserContext(prevState => res?.data) : SetUserContext(prevState => UserContext); console.log("Error: Could not update account information!");
    //         }).catch((err) => {
    //         console.log(err);
    //     });
    // }, [UserContext.account_id, SetUserContext]);

    const largeScreen = useMediaQuery((theme: { breakpoints: { up: (arg0: string) => any; }; }) => theme.breakpoints.up('md'));

    return(
        <Box sx={{mt:3, mr:3, ml:3}}>
            <Box sx={{mt: 3}}>
                <Typography variant="h5">Welcome back {UserContext.name}.</Typography>
                <Typography variant="h6" sx={{mt: 2}}>Total Asset Value: 1952.22$</Typography>
            </Box>
            <Divider sx={{mt: 3}}/>
            <Stack direction={largeScreen?"row":"column"} gap={3} sx={{mt: 3}}>
                <Box sx={{}}>
                    <Stack direction="column" gap={1} sx={{}}>
                        <Stack direction="row" gap={1} style={{justifyContent:"space-between"}}>
                            <Typography variant="h6">Fiat accounts</Typography>
                            <Button variant="outlined" className="create" onClick={CreateNewAccount}>New Account</Button>
                        </Stack>

                        <List>
                            {UserContext.fiat_accounts?.map((faccount, index) => {
                                return (<AccountEntry key={index} account={faccount} type={"fiat"} onAccountChange={() => {}}/>)
                            })}
                        </List>
                    </Stack>
                </Box>

                <Divider orientation="vertical" flexItem />

                <Box sx={{}}>
                    <Stack direction="column" gap={1} sx={{}}>
                        <Stack direction="row" gap={1} style={{justifyContent:"space-between"}}>
                            <Typography variant="h6">Crypto accounts</Typography>
                            <Button variant="outlined" className="create" onClick={CreateNewAccount}>New Account</Button>
                        </Stack>

                        <List>
                            {UserContext.crypto_accounts?.map((caccount, index) => {
                                return (<AccountEntry key={index} account={caccount} type={"crypto"} onAccountChange={() => {}}/>)
                            })}
                        </List>
                    </Stack>
                </Box>
            </Stack>

            <Divider sx={{mt: 3}}/>

            <Box>
                <Typography variant="h6" sx={{mt: 3}}>Stocks Portfolio</Typography>
                <Typography variant="body2" sx={{mt: 3}}>Nothing here yet.</Typography>
                <Button variant="outlined" color="success" sx={{my: 3}}>Buy Stocks</Button>

                <Accordion sx={{maxWidth:largeScreen ? 320 : 320, minWidth:largeScreen ? 320 : 320}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                            <Typography>
                                <Grid2 container spacing={1}>
                                    <Grid2><InventoryIcon sx={{fontSize: 24}} /></Grid2>
                                    <Grid2>Sample stock SMPL</Grid2>
                                </Grid2>
                            </Typography>

                            <Typography>120$</Typography>
                        </div>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Stack direction="row" gap={1} sx={{}}>
                            <Stack direction="column" gap={1} sx={{}}>
                                <Typography>Cost average: 4.45$</Typography>
                                <Typography>Quantity: 12</Typography>
                                <Typography>Current price: 10.00$</Typography>
                            </Stack>
                            <Divider orientation="vertical" flexItem />
                            <Button variant="outlined" color="error" sx={{mt: 3}}>Sell</Button>
                        </Stack>
                    </AccordionDetails>
                </Accordion>

            </Box>

            <Divider sx={{mt: 3}}/>

            <Box>
                <Typography variant="h6" sx={{mt: 3}}>Credit Cards</Typography>
                <Typography variant="body2" sx={{mt: 3}}>Nothing here yet.</Typography>
            </Box>
            <Divider sx={{mt: 3}}/>
        </Box>
    );
}