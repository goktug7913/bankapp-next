import React, {useContext} from 'react';

import {
    Button,
    List,
    Stack,
    Typography,
    Divider,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails, Tooltip, IconButton
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InventoryIcon from '@mui/icons-material/Inventory';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from "@mui/material/styles";

import {UserCtx} from "@/context/UserState";
import {AccountEntry} from "@/components/AccountEntry";

import {useRouter} from "next/router";
import {trpc} from "@/utils/trpc";

export default function Dashboard() {
    const UserContext = useContext(UserCtx).user;
    const router = useRouter();

    function CreateNewAccount() {
        // Redirect to creation page
        router.push("/createAccount").then();
    }

    // Let's update the user context on page load
    // This is to make sure that the user context is up-to-date
    const UserData = trpc.getMasterAccount.useQuery();
    const TotalAssetValue = trpc.getTotalValue.useQuery({ display_currency: "USD" }, {
        refetchOnWindowFocus: "always",
    });
    const CryptoQuery = trpc.getSubAccounts.useQuery({ type: "crypto" });
    const FiatQuery = trpc.getSubAccounts.useQuery({ type: "fiat" });

    const theme = useTheme();
    const largeScreen = useMediaQuery(theme.breakpoints.up('md'));

    return(
        <Box sx={{mt:3, mx:3}}>

            <Box sx={{mt: 3}}>
                <Typography variant="h5">Welcome back {UserContext.name}.</Typography>

                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Typography variant="h6">
                        Total Asset Value: {TotalAssetValue.isLoading ? "Loading..." : TotalAssetValue.data?.totalValue + "$"}
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

            <Box sx={{}}>
                <Stack direction="row" gap={1} style={{justifyContent: largeScreen ? "" : "space-between"}}>
                    <Typography variant="h6" sx={{}}>Stocks Portfolio</Typography>
                    <Button variant="outlined" color="success" sx={{}}>Buy Stocks</Button>
                </Stack>

                <Accordion sx={{maxWidth:largeScreen ? 320 : 320, minWidth:largeScreen ? 320 : 320, mt:2}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                            <Grid2 container spacing={1}>
                                <Grid2><InventoryIcon sx={{fontSize: 24}} /></Grid2>
                                <Grid2>Sample stock SMPL</Grid2>
                            </Grid2>

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

            <Divider sx={{my: 3}}/>

            <Box sx={{}}>
                <Typography variant="h6" sx={{mt: 3}}>Credit Cards</Typography>
                <Typography variant="body2" sx={{mt: 3}}>Nothing here yet.</Typography>
            </Box>
            <Divider sx={{mt: 3}}/>
        </Box>
    );
}