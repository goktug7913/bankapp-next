import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";
import React from "react";

interface IInitialProps {
    sender_account?: string;
}

export default function SendMoney( {sender_account}: IInitialProps) {
    const mock:any = []
    return (
        <Box sx={{ p:2 }}>
            <Box>
                <FormControl sx={{display: "flex"}}>
                    <InputLabel id="account-label">Select Account</InputLabel>
                        <Select
                            labelId="account-label"
                            id="account"
                            label="Select Account"
                            defaultValue={""}
                            fullWidth
                            sx={{ flexGrow: 1 }}
                        >
                            {mock.map((c: any) => (
                                <MenuItem key={c.id} value={c.ticker}>{c.ticker + " - " + c.name}</MenuItem>
                            ))}
                        </Select>
                </FormControl>
            </Box>

            <Box sx={{ pt:2 }}>
                <TextField fullWidth label="Receiver Account Number" />
            </Box>

            <Box sx={{ pt:2 }}>
                <TextField fullWidth label="Amount" />
            </Box>

            <Box sx={{ pt:2 }}>
                <TextField fullWidth label="Description" />
            </Box>

            <Stack direction="row" spacing={2} sx={{ pt:2 }}>
                <Button variant="contained">Send</Button>
                <Button variant="contained">Cancel</Button>
            </Stack>
        </Box>
    )
}