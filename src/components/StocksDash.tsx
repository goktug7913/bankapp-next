import {Box, Button, Stack, Typography} from "@mui/material";

import React from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Grid2 from "@mui/material/Unstable_Grid2";
import StockEntry from "@/components/StockEntry";
import {trpc} from "@/utils/trpc";
import { useRouter } from "next/router";

export default function StocksDash() {
    const theme = useTheme();
    const largeScreen = useMediaQuery(theme.breakpoints.up('md'));
    const router = useRouter();

    const PortfolioQuery = trpc.getStocksPortfolio.useQuery(undefined, {
        staleTime: 1000 * 60, // 60 seconds for testing
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    // A convoluted way of calculating the total value of the portfolio:
    const [totalValue, setTotalValue] = React.useState(0);

    // We will pass the setter function to the StockEntry components,
    // and they will use it with prev state to update the total value...

    return (
        <Box sx={{}}>
            <Stack direction="row" gap={1} style={{justifyContent: largeScreen ? "" : "space-between"}}>
                <Typography variant="h6" sx={{}}>Stocks Portfolio</Typography>
                <Button variant="outlined" color="success" onClick={() => router.push("/stocks/buy")}>Buy Stocks</Button>
            </Stack>

            <Typography variant="h6" sx={{}}>Total Value: {totalValue.toLocaleString()}$</Typography>

            <Grid2 container spacing={2} sx={{mt: 2}}>
            {!PortfolioQuery.isLoading && !PortfolioQuery.isError && PortfolioQuery.isSuccess && 
                PortfolioQuery.data.CustomerStock.map((stock, idx) => {
                    return (
                        <Grid2 xs={12} sm={6} md={6} lg={4} xl={3} key={idx}>
                            <StockEntry dataIn={stock} setTotalValue={setTotalValue} /> 
                        </Grid2>
                    )
                })
            }
            </Grid2>

        </Box>
    )
}