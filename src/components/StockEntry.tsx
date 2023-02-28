import {Accordion, AccordionDetails, AccordionSummary, Button, Divider, Stack, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid2 from "@mui/material/Unstable_Grid2";
import InventoryIcon from "@mui/icons-material/Inventory";
import React from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface StockEntryProps {
    stock: any // TODO: type this
}

export default function StockEntry() {

    const theme = useTheme();
    const largeScreen = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <Accordion>
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
                <Stack direction="row" gap={1} justifyContent={"space-evenly"}>
                    <Stack direction="column" gap={1} sx={{}}>
                        <Typography>Quantity: 12</Typography>
                        <Typography>Current price: 10.00$</Typography>
                        <Typography>Cost average: 4.45$</Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Button variant="outlined" color="success" sx={{mt: 6}}>Buy</Button>
                    <Button variant="outlined" color="error" sx={{mt: 6}}>Sell</Button>
                </Stack>
            </AccordionDetails>
        </Accordion>
    )
}