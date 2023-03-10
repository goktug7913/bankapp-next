import React, {useContext, useEffect} from 'react';

import {
    Button,
    List,
    Stack,
    Typography,
    Divider,
    Box,
    Tooltip, IconButton
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from "@mui/material/styles";

import {UserCtx} from "@/context/UserState";
import {AccountEntry} from "@/components/AccountEntry";

import {useRouter} from "next/router";
import {trpc} from "@/utils/trpc";
import StocksDash from "@/components/StocksDash";

export default function Dashboard() {

    const router = useRouter();
    const UserContext = useContext(UserCtx).user;

    // Redirect to login if we are signed out for some reason, or was never signed in.
    useEffect(() => {
        if (!UserContext.token) { router.push("/login").then() }
    }, [UserContext.token]);

    const TotalAssetValue = trpc.getTotalValue.useQuery({ display_currency: "USD" }, { refetchOnWindowFocus: "always" });
    const CryptoQuery = trpc.getSubAccounts.useQuery({ type: "crypto" });
    const FiatQuery = trpc.getSubAccounts.useQuery({ type: "fiat" });

    const theme = useTheme();
    const largeScreen = useMediaQuery(theme.breakpoints.up('md'));

    function CreateNewAccount() {
        // Redirect to creation page
        router.push("/createAccount").then();
    }

    return(
        <Box sx={{mt:3, mx:3}}>

            <Box sx={{mt: 3}}>
                <Typography variant="h5">Welcome back {UserContext.name}.</Typography>

                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Typography variant="h6">
                        Total Asset Value: {TotalAssetValue.isLoading ? "Loading..." : TotalAssetValue.data?.totalValue.toLocaleString() + "$"}
                    </Typography>

                    <Tooltip title="This shows total value of all your assets, but I hit the free exchange rate API limits, so currently it calculates random rates. :(">
                        <IconButton size={"small"} color={"primary"}><InfoOutlinedIcon fontSize="small" /></IconButton>
                    </Tooltip>
                </Box>

            </Box>

            <Divider sx={{my: 3}}/>

            <Grid2 container gap={0} spacing={3} rowSpacing={0}>
                <Grid2 xs={12} sm={6} md={6}>
                    <Stack direction="column" gap={1}>
                        <Stack direction="row" gap={1} style={{justifyContent:"space-between"}}>
                            <Typography variant="h6">Fiat accounts</Typography>
                            <Button variant="outlined" className="create" onClick={CreateNewAccount}>New Account</Button>
                        </Stack>

                        <List>
                            {FiatQuery.data?.accounts?.map((account, index) => {
                                return (<AccountEntry key={index} m_id={account.id} type={"fiat"} onAccountChange={() => {}}/>)
                            })}
                        </List>
                    </Stack>
                </Grid2>

                <Grid2 xs={12} sm={6} md={6}>
                    <Stack direction="column" gap={1}>
                        <Stack direction="row" gap={1} style={{justifyContent:"space-between"}}>
                            <Typography variant="h6">Crypto accounts</Typography>
                            <Button variant="outlined" className="create" onClick={CreateNewAccount}>New Account</Button>
                        </Stack>

                        <List>
                            {CryptoQuery.data?.accounts?.map((account, index) => {
                                return (<AccountEntry key={index} m_id={account.id} type={"crypto"} onAccountChange={() => {}}/>)
                            })}
                        </List>
                    </Stack>
                </Grid2>
            </Grid2>

            <Divider sx={{my: 3}}/>

            <StocksDash />

            <Divider sx={{my: 3}}/>

            <Box sx={{}}>
                <Typography variant="h6" sx={{mt: 3}}>Credit Cards</Typography>
                <Typography variant="body2" sx={{mt: 3}}>Nothing here yet.</Typography>
            </Box>
            <Divider sx={{mt: 3}}/>
        </Box>
    );
}