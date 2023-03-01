import {Accordion, AccordionDetails, AccordionSummary, Button, Divider, Stack, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid2 from "@mui/material/Unstable_Grid2";
import InventoryIcon from "@mui/icons-material/Inventory";
import React from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {Stocks,CustomerStock} from "@prisma/client"
import {trpc} from "@/utils/trpc";

interface StockEntryProps {
    dataIn: CustomerStock,
    setTotalValue: React.Dispatch<React.SetStateAction<number>>
}

export default function StockEntry({dataIn, setTotalValue}: StockEntryProps) {

    // We know what to query from the prop we got
    const StockQuery = trpc.getOwnedStockData.useQuery({id: dataIn.stock_id}, {
        // We never want to refetch this data, so we set the staleTime to Infinity
        staleTime: Infinity,
        onSuccess: (data) => {
            // We use the setter function to update the total value
            setTotalValue(prev => prev + (data?.price * dataIn.amount));
        }
    });

    const theme = useTheme();
    const largeScreen = useMediaQuery(theme.breakpoints.up('md'));

    // Let's not render at all while we're loading
    if (StockQuery.isLoading) return null;
    const data = StockQuery.data;

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>

                    <Grid2 container spacing={1}>
                        <Grid2><InventoryIcon sx={{fontSize: 24}} /></Grid2>
                        <Grid2>{data?.name}</Grid2>
                    </Grid2>

                    <Typography>{data?.price}$</Typography>
                </div>
            </AccordionSummary>

            <AccordionDetails>
                <Stack direction="row" gap={1} justifyContent={"space-evenly"}>
                    <Stack direction="column" gap={1} sx={{}}>
                        <Typography>Quantity: {dataIn.amount}</Typography>
                        <Typography>Current price: {data?.price}$</Typography>
                        {/* <Typography>Cost average: 4.45$</Typography> */}
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Button variant="outlined" color="success" sx={{mt: 6}}>Buy</Button>
                    <Button variant="outlined" color="error" sx={{mt: 6}}>Sell</Button>
                </Stack>
            </AccordionDetails>
        </Accordion>
    )
}