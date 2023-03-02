import { Box, FormControl, Typography, Select, InputLabel, Container, Divider, MenuItem, Stack, Button, Paper, Chip, TextField } from "@mui/material";
import {trpc} from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Grid2 from "@mui/material/Unstable_Grid2/";

export default function BuyStock() {

    interface IBasket {
        [key: string]: IBasketEntry;
    }
    
    interface  IBasketEntry {
        stock: typeof AllStocksQuery.data[];
        amount: number;
    }

    const router = useRouter();

    const BuyStock = trpc.buyStock.useMutation();
    const AllStocksQuery = trpc.getAllTradedStocks.useQuery(undefined, {
        staleTime: Infinity,
    });

    const Accounts = trpc.getSubAccounts.useQuery({ type: "all" }, {
        onSuccess: (data) => {
            setSelectedAccount(data.accounts[0]);
        }
    });
    const [selectedAccount, setSelectedAccount] = useState(Accounts.data?.accounts[0]);
    const [basket, setBasket] = useState<IBasket>({});
    const [searchString, setSearchString] = useState<string>("");
    const [filteredStocks, setFilteredStocks] = useState<typeof AllStocksQuery.data[]>([]);

    const stocks = searchString === "" ? AllStocksQuery.data : filteredStocks;

    useEffect(() => {
        if (AllStocksQuery.isSuccess && searchString !== "") {
            const filteredStocks = AllStocksQuery.data.filter((stock) => {
                return stock.name.toLowerCase().includes(searchString.toLowerCase());
            });
            setFilteredStocks(filteredStocks as any);
        }
    }, [searchString]);

    return (
        <Container maxWidth={"md"} sx={{mt:2}}>
            <Typography variant="h5">Buy Stock</Typography>

            <Divider sx={{ my: 2, mb:3 }} />

            <Box maxWidth={350}>
                <FormControl sx={{display: "flex"}}>
                    <InputLabel id="account-label">Select Account</InputLabel>
                        <Select
                            labelId="account-label"
                            id="account"
                            label="Payment Account"
                            fullWidth
                            sx={{ flexGrow: 1 }}
                            value={selectedAccount}
                            onChange={(e) => setSelectedAccount(e.target.value as any)}
                            required
                        >
                            {Accounts.data?.accounts.map((c: any) => (
                                <MenuItem key={c.id} value={c}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Stack direction="column" spacing={1}>
                                            <Typography>{c.name}</Typography>
                                            <Typography variant="caption">{c.account_id}</Typography>
                                        </Stack>

                                        <Stack direction="row" spacing={1}>
                                            <Typography>{c.balance}</Typography>
                                            <Typography>{c.currency}</Typography>
                                        </Stack>
                                    </Stack>
                                </MenuItem>
                            ))}
                        </Select>
                </FormControl>
            </Box>

            <Divider sx={{ my: 2, mb:3 }} />

            <Grid2 container spacing={1.5} alignContent={"center"}>
                {AllStocksQuery.isLoading && <Typography>Loading...</Typography>}
                <Grid2 xs={12} sm={2} md={3} lg={3}>
                    <Button variant="outlined" color="success" onClick={() => AllStocksQuery.refetch()} 
                    fullWidth>
                        Refresh
                    </Button>
                </Grid2>

                <Grid2 xs={12} sm={2} md={3} lg={3}>
                    <Button variant="outlined" color="warning" onClick={() => setBasket({})} 
                    fullWidth>
                        Clear
                    </Button>
                </Grid2>

                <Grid2 xs={12} sm={8} md={6} lg={6}>
                    { /* Search bar */ }
                    <TextField fullWidth label="Search" variant="outlined" size="small" margin="dense"
                    onChange={(e) => setSearchString(e.target.value)} value={searchString} />
                </Grid2>

            </Grid2>

            <Grid2 container spacing={1.5} alignContent={"stretch"} mt={2}>
                {AllStocksQuery.isSuccess && stocks?.map((stock, idx) => {
                    return (
                        <Grid2 key={idx} maxWidth={"xs"} xs={12} sm={6} md={3}>
                            <Paper sx={{p:1.5, height:"100%", alignContent:"space-between"}}>
                                <Stack direction={"row"} justifyContent={"space-between"}>

                                    <Chip label={stock?.ticker} size="small" color="primary" variant="outlined" />
                                    <Typography variant="body2">{stock?.name}</Typography>

                                    <Typography variant="body2">{stock?.price}$</Typography>
                                </Stack>

                                <Stack direction={"row"} justifyContent={"space-between"} sx={{pt:1}}>
                                    <Typography variant="caption">Total</Typography>
                                    <Typography variant="caption">
                                        {basket[stock?.ticker]?.amount ? (basket[stock?.ticker]?.amount * stock?.price).toLocaleString() : "0"}$
                                    </Typography>
                                </Stack>

                                <Stack direction={"row"} sx={{mt:1}}>
                                    <Button variant="outlined" color="success" sx={{
                                    }}
                                        onClick={() => {
                                            if (basket[stock?.ticker]) {
                                                setBasket({...basket,[stock?.ticker]: {...basket[stock?.ticker],amount: basket[stock?.ticker].amount + 1}
                                                })
                                            } else {
                                                setBasket({...basket,[stock?.ticker]: {stock: [stock], amount: 1}})
                                            }
                                        }}
                                    >
                                        +
                                    </Button>


                                    <TextField title="Amount" type="number" value={basket[stock?.ticker]?.amount || 0}
                                        sx={{textAlign: "center", flexGrow:"initial"}} size="small" variant="outlined"
                                        aria-valuemin={0}
                                        
                                        onChange={(e) => {
                                            // If we're deleting the last character, set the amount to 0
                                            if (e.target.value === "") {
                                                const newBasket = { ...basket };
                                                delete newBasket[stock?.ticker];
                                                setBasket(newBasket);
                                                return;
                                            }
                                            if (basket[stock?.ticker]) {
                                                setBasket({...basket,[stock?.ticker]: {...basket[stock?.ticker],amount: parseInt(e.target.value)}
                                                })
                                            } else {
                                                setBasket({...basket,[stock?.ticker]: {stock: [stock], amount: parseInt(e.target.value)}})
                                            }
                                        }}
                                    />

                                    
                                    <Button variant="outlined" color="error"
                                        disabled={basket[stock?.ticker]?.amount === 0}
                                        onClick={() => {
                                            if (basket[stock?.ticker]) {
                                                if (basket[stock?.ticker].amount > 1) {
                                                    setBasket({...basket,[stock?.ticker]: {...basket[stock?.ticker],amount: basket[stock?.ticker].amount - 1}
                                                    })
                                                } else {
                                                    const newBasket = { ...basket };
                                                    delete newBasket[stock?.ticker];
                                                    setBasket(newBasket);
                                                }
                                            }
                                        }}
                                    >
                                        -
                                    </Button>
                                </Stack>
                            </Paper>
                        </Grid2>
                    )
                })}
            </Grid2>
            <Divider sx={{ my: 2, mb:3 }} />
            <Box>
                <Typography variant="h6">Summary</Typography>
                <Typography variant="caption">Total: {(Object.values(basket).reduce((acc, curr) => acc + curr.amount * curr?.stock[0]?.price, 0).toLocaleString())}$</Typography>
                <Grid2 container sx={{mt:2}} spacing={1}>
                    {Object.values(basket).map((entry, idx) => {
                        return (
                            <Grid2 container key={idx} sx={{mb:1}} xs={12}>
                                <Grid2 key={idx} sx={{mb:1}} xs={1}>
                                    <Typography variant="body2">{entry.stock[0].ticker}</Typography>
                                </Grid2>
                                <Grid2 key={idx} sx={{mb:1}} xs={1}>
                                    <Typography variant="body2">{entry.amount} shares</Typography>
                                </Grid2>
                                <Grid2 key={idx} sx={{mb:1}} xs={2}>
                                    <Typography variant="body2">{(entry.amount * entry.stock[0].price).toLocaleString()}$</Typography>
                                </Grid2>
                            </Grid2>
                        )
                    })}
                </Grid2>
                <Button variant="outlined" color="success" fullWidth
                    onClick={() => { BuyStock.mutate({
                    symbol: "AAPL", // Dummy symbol
                    amount: 1, 
                    paymentAccount:selectedAccount?.id as string, // We should remove casting here
                    paymentAccountType: "fiat"
                    }) }}
                >
                    Buy
                </Button>
            </Box>
            

        </Container>
    )
}