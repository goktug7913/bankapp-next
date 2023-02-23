import {
    Box,
    CircularProgress, Divider, FormControl, InputLabel,
    MenuItem,
    Select, SelectChangeEvent,
    Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { useContext } from "react";
import { UserCtx } from "@/context/UserState";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import TextField from "@mui/material/TextField";

export default function Settings() {
    const qc = trpc.useContext();
    const UserContext = useContext(UserCtx).user;

    const SettingsQuery = trpc.getSettings.useQuery();
    const curs = trpc.getCurrencies.useQuery();

    const router = useRouter();

    const updateCurrency = (e: SelectChangeEvent) => {

    };

    return (
        <Box sx={{ mt: 2, mx: 3 }}>
            <Typography variant="h4">Settings</Typography>
            <Divider sx={{ my: 1 }} />

            <Box sx={{ mt: 3 }}>
                <Grid2 container spacing={2}>
                    <Grid2 xs={12} md={6}>
                        <Box sx={{ padding: 2 }}>
                            <Typography variant="h5">General</Typography>

                            <Box sx={{ paddingTop: 2 }}>
                                <TextField fullWidth label="Name" disabled value={UserContext.name} />
                            </Box>
                            <Box sx={{ paddingTop: 2 }}>
                                <TextField fullWidth label="Surname" disabled value={UserContext.surname} />
                            </Box>
                            <Box sx={{ paddingTop: 2 }}>
                                <TextField fullWidth label="Email" disabled value={UserContext.email} />
                            </Box>

                            <Box sx={{ paddingTop: 2 }}>
                                <FormControl sx={{display: "flex"}}>
                                    <InputLabel id="display-currency-label">Display Currency</InputLabel>
                                    {curs.isLoading ? <CircularProgress color="primary" /> :
                                        <Select
                                            labelId="display-currency-label"
                                            id="display-currency"
                                            label="Display Currency"
                                            onChange={updateCurrency}
                                            defaultValue={SettingsQuery?.data?.currency}
                                            fullWidth
                                            sx={{ flexGrow: 1 }}
                                        >
                                            {curs?.data?.map((c: any) => (
                                                <MenuItem key={c.id} value={c.ticker}>{c.ticker + " - " + c.name}</MenuItem>
                                            ))}
                                        </Select>
                                    }
                                </FormControl>
                            </Box>

                        </Box>
                    </Grid2>

                    <Grid2 xs={12} md={6}>
                        <Box sx={{ padding: 2 }}>
                            <Typography variant="h5">Security</Typography>
                        </Box>
                    </Grid2>
                </Grid2>
            </Box>
        </Box>
    );
}