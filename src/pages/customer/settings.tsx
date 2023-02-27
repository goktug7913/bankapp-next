import {
    Box, Button,
    CircularProgress, Divider, FormControl, IconButton, InputLabel,
    MenuItem,
    Select, SelectChangeEvent, Tooltip,
    Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { useContext } from "react";
import { UserCtx } from "@/context/UserState";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import TextField from "@mui/material/TextField";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Settings() {
    const qc = trpc.useContext();
    const UserContext = useContext(UserCtx).user;

    const SettingsQuery = trpc.getSettings.useQuery();
    const curs = trpc.getCurrencies.useQuery();

    const router = useRouter();

    const theme = useTheme();
    const largeScreen = useMediaQuery(theme.breakpoints.up('md'));

    const updateCurrency = (e: SelectChangeEvent) => {

    };

    return (
        <Box sx={{ mt: 2, mx: 2 }}>
            <Typography variant="h4">Settings</Typography>
            <Divider sx={{ my: 1 }} />

            <Box sx={{ mt: 3 }}>
                <Grid2 container spacing={2}>
                    <Grid2 xs={12} md={4}>
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

                    {!largeScreen &&
                        <Grid2 xs={12} md={6} sx={{px:3}}><Divider orientation="horizontal" flexItem/></Grid2>
                    }

                    <Grid2 xs={12} md={4}>
                        <Box sx={{ padding: 2 }}>
                            <Typography variant="h5">Security</Typography>

                            <Box sx={{ paddingTop: 2 }}>
                                <TextField type={"password"} fullWidth label="Current Password" />
                            </Box>
                            <Box sx={{ paddingTop: 2 }}>
                                <TextField type={"password"} fullWidth label="New Password" />
                            </Box>
                            <Box sx={{ paddingTop: 2 }}>
                                <TextField type={"password"} fullWidth label="Confirm New Password" />
                            </Box>

                            <Button sx={{ mt: 2 }} fullWidth variant="outlined">Change Password</Button>
                            <Button sx={{ mt: 2 }} fullWidth color={"warning"} variant="outlined">
                                Temporary Deactivation
                                <Tooltip title="Your account will be deactivated temporarily, you can reactivate by contacting via e-mail.">
                                    <IconButton size={"small"} color={"inherit"}><InfoOutlinedIcon fontSize="small" /></IconButton>
                                </Tooltip>
                            </Button>
                            <Button sx={{ mt: 2 }} fullWidth color={"error"} variant="outlined">Delete Account</Button>
                        </Box>
                    </Grid2>
                </Grid2>
            </Box>
        </Box>
    );
}