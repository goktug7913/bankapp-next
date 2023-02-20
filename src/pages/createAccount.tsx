import React, {useEffect} from "react";
import {
    Box,
    Button,
    Container,
    TextField,
    Select,
    Tabs,
    Tab,
    MenuItem,
    CircularProgress,
    FormControl, InputLabel
} from "@mui/material";
import {UserCtx} from "@/context/UserState";
import {useContext} from "react";
import {useRouter} from "next/router";
import {trpc} from "@/utils/trpc";
import {Currency} from "@prisma/client";

function tabProps(index: number) {
    return { id: `simple-tab-${index}`, 'aria-controls': `simple-tabpanel-${index}` };
}

export default function CreateAccount() {
    const [type, setType] = React.useState<"Fiat" | "Crypto">("Fiat");
    const [fiatList, setFiatList] = React.useState<Currency[]>([] as Currency[]);
    const [cryptoList, setCryptoList] = React.useState<Currency[]>([] as Currency[]);
    const [currency, setCurrency] = React.useState<Currency>(fiatList[0]);

    const [accountName, setAccountName] = React.useState("");
    const [tab, setTab] = React.useState(0);
    const UserContext = useContext(UserCtx);
    const router = useRouter();

    const curs = trpc.getCurrencies.useQuery();
    const createFiat = trpc.createFiatAccount.useMutation();
    const createCrypto = trpc.createCryptoAccount.useMutation();

    useEffect(() => {
        if (curs.data) {
            console.log(curs.data);
            // When the data is ready, filter the currencies into two lists
            setFiatList(curs.data.filter((c:Currency) => c.type === "FIAT"));
            setCryptoList(curs.data.filter((c:Currency) => c.type === "CRYPTO"));
        }
    }, [curs.data]);
    const updateType = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
        setType(newValue === 0 ? "Fiat" : "Crypto");
        setCurrency(type === "Fiat" ? fiatList[0] : cryptoList[0])
    };
    const updateCurrency = (e: any) => {
        setCurrency(e.target.value);
    }
    const onSubmit = (e: any) => {
        e.preventDefault();
        const data = {
            account_id: UserContext.user.account_id,
            currency_ticker: currency,
            name: accountName,
        }
        console.log(data);
        if (type === "Fiat") {
            createFiat.mutate(data);
        } else {
            createCrypto.mutate(data);
        }
    }

    useEffect(() => {
        if (createFiat.isSuccess) {
            console.log("Success");
            router.push("/dashboard");
        } else if (createFiat.error) {
            console.log(createFiat.error);
        } else {
            console.log("Loading");
        }
    } , [createFiat.isSuccess, createFiat.error]);

    useEffect(() => {
        if (createCrypto.isSuccess) {
            console.log("Success");
            router.push("/dashboard");
        } else if (createCrypto.error) {
            console.log(createCrypto.error);
        } else {
            console.log("Loading");
        }
    } , [createCrypto.isSuccess, createCrypto.error]);

    return(
        <Container maxWidth={"sm"}>
            <h1>Create Account</h1>
            <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1, minWidth: "full" }}>
                <Tabs value={tab} onChange={updateType} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab value={0} label={"Fiat"} {...tabProps(0)}/>
                    <Tab value={1} label={"Crypto"} {...tabProps(1)}/>
                </Tabs>

                <FormControl fullWidth required sx={{ mt: 3 }}>
                    <InputLabel id="Currency">Currency</InputLabel>
                    {curs.isLoading ? <CircularProgress color="primary" /> :
                    <Select onChange={updateCurrency} labelId="Currency" value={currency?.ticker}>
                        {(type==="Fiat" ? fiatList : cryptoList).map((c: any) => <MenuItem key={c.id} value={c.ticker}>{c.ticker + " - " + c.name}</MenuItem>)}
                    </Select>}
                </FormControl>
                <TextField sx={{ mt: 3, mb: 2 }} fullWidth required value={accountName} onChange={e => setAccountName(e.target.value)} id="account_name" type="text" placeholder="Account Name" />

                <div><Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Submit</Button></div>
            </Box>
        </Container>
    );
}