import {Box, Button, Stack, Typography} from "@mui/material";

import React from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Grid2 from "@mui/material/Unstable_Grid2";
import StockEntry from "@/components/StockEntry";
import {trpc} from "@/utils/trpc";

export default function StocksDash() {
    const theme = useTheme();
    const largeScreen = useMediaQuery(theme.breakpoints.up('md'));

    const PortfolioQuery = trpc.getStocksPortfolio.useQuery(undefined, {
        staleTime: 1000 * 5, // 5 seconds for testing
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    return (
        <Box sx={{}}>
            <Stack direction="row" gap={1} style={{justifyContent: largeScreen ? "" : "space-between"}}>
                <Typography variant="h6" sx={{}}>Stocks Portfolio</Typography>
                <Button variant="outlined" color="success" sx={{}}>Buy Stocks</Button>
            </Stack>

            <Typography variant="h6" sx={{}}>Total Value: 152$</Typography>
            {PortfolioQuery.isLoading && <Typography>Loading...</Typography>}
            {PortfolioQuery.isError && <Typography>Error: {PortfolioQuery.error.message}</Typography>}
            {PortfolioQuery.isSuccess && <Typography>
                <>Success: {JSON.stringify(PortfolioQuery.data,null,2)}</>
            </Typography>}

            <Grid2 container spacing={1} sx={{mt: 2}}>
                <Grid2 xs={12} sm={6} md={6} lg={4} xl={3}>
                    <StockEntry />
                </Grid2>
                <Grid2 xs={12} sm={6} md={6} lg={4} xl={3}>
                    <StockEntry />
                </Grid2>
                <Grid2 xs={12} sm={6} md={6} lg={4} xl={3}>
                    <StockEntry />
                </Grid2>
                <Grid2 xs={12} sm={6} md={6} lg={4} xl={3}>
                    <StockEntry />
                </Grid2>
            </Grid2>


        </Box>
    )
}